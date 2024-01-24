DROP PROCEDURE IF EXISTS showAvailableGames;
-- Вывод всех доступных лобби
CREATE PROCEDURE showAvailableGames(tk INT UNSIGNED)
    COMMENT "Показывает все лобби, в которых игрок еще не участвует и где игра еще не началась (меньше 4 игроков). Параметры: userToken"
showAvailableGames:
BEGIN
    DECLARE userId INT;

    -- Проверка на валидность токена
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(tk);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE showAvailableGames;
    END IF;

    CALL clearSessions();

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    -- Запрос
    SELECT ul.lobby_id                             AS id,          -- Лобби Id
           COUNT(*)                                AS userCount,   -- Кол-во игроков
           IF(g.password IS NOT NULL, TRUE, FALSE) AS hasPassword, -- Есть ли пароль
           u.login                                 AS hostLogin
    FROM UsersInLobby ul
             LEFT JOIN UsersInLobby ul2 ON ul2.lobby_id = ul.lobby_id AND ul2.user_id = userId
             INNER JOIN GameLobbies g ON ul.lobby_id = g.id
             LEFT JOIN Users u ON g.host_id = u.id
    WHERE ul2.user_id IS NULL
    GROUP BY ul.lobby_id
    HAVING userCount < 4;
END showAvailableGames;

DROP PROCEDURE IF EXISTS getCurrentGames;
-- Вывод всех лобби, в которых игрок уже участвует
CREATE PROCEDURE getCurrentGames(tk INT UNSIGNED)
    COMMENT "Показывает все лобби, в которых игрок уже участвует. Параметры: userToken"
getCurrentGames:
BEGIN
    DECLARE userId INT;

    -- Проверка на валидность токена
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(tk);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE getCurrentGames;
    END IF;

    CALL clearSessions();

    SELECT id INTO userId FROM Users WHERE login = userLogin;

    -- Запрос
    SELECT gl.id,
           COUNT(ul2.user_id) AS userCount,
           u.login            AS hostLogin
    FROM GameLobbies AS gl
             JOIN UsersInLobby AS ul ON gl.id = ul.lobby_id
             LEFT JOIN UsersInLobby AS ul2 ON gl.id = ul2.lobby_id
             LEFT JOIN Users u ON gl.host_id = u.id
    WHERE ul.user_id = userId
    GROUP BY gl.id;

END getCurrentGames;

DROP PROCEDURE IF EXISTS getUsersInLobby;
-- Вывод информации о лобби
CREATE PROCEDURE getUsersInLobby(tk INT UNSIGNED, lobbyId INT UNSIGNED)
    COMMENT "Показать информацию о лобби. Параметры: userToken, lobbyId"
getUsersInLobby:
BEGIN

    DECLARE userId INT;

    -- Проверка на валидность токена
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(tk);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE getUsersInLobby;
    END IF;

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    -- Проверка на существование лобби
    IF NOT EXISTS (SELECT 1 FROM GameLobbies WHERE id = lobbyId) THEN
        SELECT 'Лобби не существует' AS error;
        LEAVE getUsersInLobby;
    END IF;

    -- Проверка на то, что пользователь в лобби
    IF NOT EXISTS (SELECT 1 FROM UsersInLobby WHERE user_id = userId AND lobby_id = lobbyId) THEN
        SELECT 'Пользователь не в лобби' AS error;
        LEAVE getUsersInLobby;
    END IF;

    UPDATE UsersInLobby SET last_activity_time = NOW() WHERE user_id = userId AND lobby_id = lobbyId;

    -- Запрос
    -- Выдать всех игроков и их кол-во выигранных игр
    SELECT u.id AS user_id, u.login AS login, u.win_count, ul.is_ready
    FROM UsersInLobby ul
             JOIN Users u ON ul.user_id = u.id
    WHERE ul.lobby_id = lobbyId;
END getUsersInLobby;

-- Вывод хоста лобби
CREATE PROCEDURE getHost(lobbyId INT UNSIGNED)
    COMMENT "Вывод хоста лобби. Параметры: lobbyId"
getHost:
BEGIN
    SELECT host_id FROM GameLobbies WHERE id = lobbyId;
END getHost;

-- Настройки лобби
CREATE PROCEDURE getLobbySettings(lobbyId INT UNSIGNED)
    COMMENT "Получить настройки лобби. Параметры: lobbyId"
getLobbySettings:
BEGIN
    DECLARE hasPassword BOOLEAN DEFAULT FALSE;
    IF (SELECT password FROM GameLobbies WHERE id = lobbyId) IS NOT NULL THEN
        SET hasPassword = true;
    END IF;
    SELECT hasPassword, turn_time, check_time FROM GameLobbies WHERE id = lobbyId;
END getLobbySettings;

DROP PROCEDURE IF EXISTS createLobby;
-- Создать игровое лобби
CREATE PROCEDURE createLobby(tk INT UNSIGNED, pw VARCHAR(10), turnT INT UNSIGNED, checkT INT UNSIGNED)
    COMMENT "Создание игрового лобби. Параметры: userToken, password, turnTime, checkTime"
createLobby:
BEGIN

    DECLARE userId INT;

    -- Проверка на валидность токена
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(tk);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE createLobby;
    END IF;

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    -- Запрос
    INSERT INTO GameLobbies (password, turn_time, check_time, host_id, state) VALUES (pw, turnT, checkT, userId, 'Start');
    INSERT INTO UsersInLobby (user_id, lobby_id, is_ready, last_activity_time)
    VALUES ((SELECT id FROM Users WHERE login = userLogin), LAST_INSERT_ID(), 1, NOW());
    SELECT LAST_INSERT_ID() AS lobbyID;

END createLobby;


-- Начата ли игра?
CREATE FUNCTION isGameStarted(lobbyId INT UNSIGNED) RETURNS BOOLEAN
    COMMENT "Проверка на начало игры. Параметры: lobbyId"
BEGIN
    DECLARE isGameStarted BOOLEAN DEFAULT FALSE;
    IF EXISTS (SELECT 1 FROM CurrentTurn WHERE turn_player_id IN (SELECT id FROM Players WHERE lobby_id = lobbyId)) THEN
        SET isGameStarted = true;
    END IF;
    RETURN isGameStarted;
END;

DROP PROCEDURE IF EXISTS enterLobby;
-- Войти в игровое лобби
CREATE PROCEDURE enterLobby(tk INT UNSIGNED, lobbyId INT UNSIGNED, inputPassword VARCHAR(10))
    COMMENT 'Процедура для входа в лобби. Параметры: userToken, lobbyId'
enterLobby:
BEGIN
    DECLARE actualPassword VARCHAR(10);
    -- Проверка на валидность токена
    DECLARE userId INT;
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(tk);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE enterLobby;
    END IF;

    CALL clearSessions();
    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    -- Проверка на то, что пользователь уже в лобби
    IF EXISTS (SELECT 1 FROM UsersInLobby WHERE user_id = userId AND lobby_id = lobbyId) THEN
        SELECT 'Пользователь уже в лобби' AS error;
        LEAVE enterLobby;
    END IF;

    -- Проверка на пароль
    SELECT password INTO actualPassword FROM GameLobbies WHERE id = lobbyId;
    -- Если пароль есть,
    IF actualPassword IS NOT NULL AND inputPassword != actualPassword THEN
        SELECT 'Неверный пароль' AS error;
        LEAVE enterLobby;
    END IF;

    -- Проверка, не превышено ли максимальное количество игроков в лобби
    IF (SELECT COUNT(*) FROM UsersInLobby WHERE lobby_id = lobbyId) = 4 THEN
        SELECT 'Лобби полное' AS error;
        LEAVE enterLobby;
    END IF;

    -- Вход в лобби
    INSERT INTO UsersInLobby (user_id, lobby_id, last_activity_time) VALUES (userID, lobbyId, NOW());
    SELECT 'Вход в лобби выполнен' AS message;
END enterLobby;

-- Поставить готовность в лобби
CREATE PROCEDURE setReady(tk INT UNSIGNED, lobbyId INT UNSIGNED, state BOOLEAN)
    COMMENT 'Поставить готовность в лобби. Параметры: userToken, lobbyId, state'
setReady:
BEGIN

    -- Проверка на валидность токена
    DECLARE userId INT;
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(tk);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE setReady;
    END IF;

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    -- Проверка, находится ли пользователь в указанном лобби
    IF NOT EXISTS (SELECT 1 FROM UsersInLobby WHERE user_id = userId AND lobby_id = lobbyId) THEN
        SELECT 'Пользователь не в лобби' AS error;
        LEAVE setReady;
    END IF;

    -- Обновление статуса готовности пользователя
    UPDATE UsersInLobby
    SET is_ready = state
    WHERE user_id = userId
      AND lobby_id = lobbyId;

    CALL getUsersInLobby(tk, lobbyId);

END setReady;

-- Выход из лобби
CREATE PROCEDURE leaveLobby(tk INT UNSIGNED, lobbyId INT UNSIGNED)
    COMMENT 'Процедура для выхода из лобби. Параметры: userToken, lobbyId'
leaveLobby:
BEGIN
    DECLARE currentHostId INT;

    -- Проверка на валидность токена
    DECLARE userId INT;
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(tk);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE leaveLobby;
    END IF;

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    -- Проверка, является ли пользователь хостом
    -- Берем id хоста
    SELECT host_id INTO currentHostId FROM GameLobbies WHERE id = lobbyId;
    IF currentHostId = userId THEN
        -- Проверяем, остались ли другие игроки в лобби
        IF (SELECT COUNT(*) FROM UsersInLobby WHERE lobby_id = lobbyId) > 1 THEN
            -- Назначаем рандомно нового хоста из оставшихся игроков
            UPDATE GameLobbies
            SET host_id =
                    (SELECT user_id
                     FROM UsersInLobby
                     WHERE lobby_id = lobbyId
                       AND user_id != userId
                     ORDER BY RAND()
                     LIMIT 1)
            WHERE id = lobbyId;
        ELSE
            -- Удаляем лобби, если других игроков нет
            DELETE FROM GameLobbies WHERE id = lobbyId;
        END IF;
    END IF;

    -- Удаляем пользователя из UsersInLobby, если лобби не удалено
    DELETE FROM UsersInLobby WHERE user_id = userId AND lobby_id = lobbyId;
    SELECT 'Выход из лобби выполнен' AS success;

    -- Если лобби удалено, то пользователь автоматически удалится из UsersInLobby

END leaveLobby;

-- Изменение настроек лобби
CREATE PROCEDURE changeLobbySettings(
    tk INT UNSIGNED,
    lobbyId INT UNSIGNED,
    newPassword VARCHAR(10),
    newTurnTime INT UNSIGNED,
    newCheckTime INT UNSIGNED
)
    COMMENT 'Изменение настроек лобби. Параметры: userToken, lobbyId, newPassword, newTurnTime, newCheckTime'
changeLobbySettings:
BEGIN

    DECLARE currentHostId INT;

    -- Проверка на валидность токена
    DECLARE userId INT;
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(tk);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE changeLobbySettings;
    END IF;

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    -- Проверка, является ли пользователь хостом лобби
    -- Берем id хоста
    SELECT host_id INTO currentHostId FROM GameLobbies WHERE id = lobbyId;
    IF currentHostId != userId THEN
        SELECT 'Пользователь не является хостом лобби' AS error;
        LEAVE changeLobbySettings;
    END IF;

    -- Обновление настроек лобби
    UPDATE GameLobbies
    SET password   = newPassword,
        turn_time  = newTurnTime,
        check_time = newCheckTime
    WHERE id = lobbyId;

    UPDATE UsersInLobby
    SET is_ready = 0
    WHERE lobby_id = lobbyId;

    SELECT 'Настройки лобби обновлены' AS success;

END changeLobbySettings;

DROP PROCEDURE IF EXISTS clearSessions;
CREATE PROCEDURE clearSessions()
    SQL SECURITY INVOKER
BEGIN
    -- Создаем временную таблицу для хранения идентификаторов сессий, которые нужно очистить
    CREATE TEMPORARY TABLE IF NOT EXISTS TempSessionIDs
    (
        session_id INT
    );

    -- Заполняем временную таблицу идентификаторами сессий для очистки
    INSERT INTO TempSessionIDs (session_id)
    SELECT s.id
    FROM GameLobbies s
             LEFT JOIN UsersInLobby su ON s.id = su.lobby_id
    GROUP BY s.id
    HAVING SUM(CASE
                   WHEN TIMESTAMPDIFF(SECOND, su.last_activity_time, NOW()) > 150 THEN 1
                   ELSE 0
        END) = COUNT(su.lobby_id);

    -- Удаляем записи из Sessions на основе временной таблицы
    DELETE s
    FROM GameLobbies s
             JOIN TempSessionIDs tmp ON s.id = tmp.session_id;

    -- Удаляем временную таблицу
    DROP TEMPORARY TABLE IF EXISTS TempSessionIDs;
END;
