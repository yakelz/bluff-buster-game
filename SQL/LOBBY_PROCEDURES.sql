-- Вывод всех доступных лобби
CREATE PROCEDURE showAvailableGames()
COMMENT "Показывает все лобби, в которых игра еще не началась (меньше 4 игроков). Без параметров"
BEGIN
    SELECT lobby_id, COUNT(*) AS usersCount FROM UsersInLobby GROUP BY lobby_id HAVING usersCount < 4;
END;

-- Вывод всех лобби, в которых игрок уже участвует
CREATE PROCEDURE getCurrentGames(tk INT UNSIGNED)
COMMENT "Показывает все лобби, в которых игрок уже участвует. Параметры: token"
BEGIN
    -- Проверка на валидность токена
	DECLARE userLogin VARCHAR(64);
	SELECT login INTO userLogin FROM Tokens WHERE token = tk;
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
    ELSE
        -- Запрос
        SELECT gl.id FROM GameLobbies AS gl
        JOIN UsersInLobby AS ul ON gl.id = ul.lobby_id
        JOIN Users AS u ON ul.user_id = u.id
        WHERE u.login = userLogin;
    END IF;
END;

-- Вывод всех игроков в лобби
CREATE PROCEDURE showUsersInLobby(lobby INT UNSIGNED)
COMMENT "Показать всех пользователей в лобби. Параметры: lobbyId"
BEGIN
   SELECT user_id FROM UsersInLobby WHERE lobby_id = lobby;
END;

-- Создать игровое лобби
DROP PROCEDURE createLobby;
CREATE PROCEDURE createLobby(tk INT UNSIGNED, pw VARCHAR(10), turnT INT UNSIGNED, checkT INT UNSIGNED)
COMMENT "Создание игрового лобби. Параметры: token, password, turnTime, checkTime"
BEGIN
    -- Проверка на валидность токена
	DECLARE userLogin VARCHAR(64);
	SELECT login INTO userLogin FROM Tokens WHERE token = tk;
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
    ELSE
        -- Запрос
        INSERT INTO GameLobbies (password, turn_time, check_time) VALUES (pw, turnT, checkT);
	    INSERT INTO UsersInLobby (user_id, lobby_id) VALUES ((SELECT id FROM Users WHERE login = userLogin), LAST_INSERT_ID());
        SELECT LAST_INSERT_ID() AS lobbyID;
    END IF;
END;

CREATE PROCEDURE enterLobby (tk INT UNSIGNED, lobbyId INT UNSIGNED)
COMMENT 'Процедура для входа в лобби. Параметры: userToken, lobbyId'
BEGIN
    -- Проверка на валидность токена
	DECLARE userLogin VARCHAR(64);
    DECLARE userId INT;
	SELECT login INTO userLogin FROM Tokens WHERE token = tk;
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
    ELSE
        -- Проверка, не превышено ли максимальное количество игроков в лобби
        IF (SELECT COUNT(*) FROM UsersInLobby WHERE lobby_id = lobbyId) = 4 THEN
            SELECT 'Лобби полное' AS error;
        ELSE
            -- Нужна ли проверка на то, что пользователь сам уже в лобби?

            -- Получение userId из login
            SELECT id INTO userId FROM Users WHERE login = userLogin;
            -- Вход в лобби
            INSERT INTO UsersInLobby (user_id, lobby_id) VALUES (userID, lobbyID);
            SELECT 'Вход в лобби успешно выполнен' AS success;
            CALL showUsersInLobby(lobbyId);
        END IF;
    END IF;
END;
