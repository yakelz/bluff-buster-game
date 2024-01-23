DROP PROCEDURE IF EXISTS initGame;
-- Начало игры
CREATE PROCEDURE initGame(token INT UNSIGNED, lobbyId INT)
    COMMENT 'Инициализация игры. Параметры: userToken, lobbyID'
initGame:
BEGIN
    DECLARE currentHostId INT;
    DECLARE userId INT;
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);

    START TRANSACTION;

    -- Проверка на валидность токена

    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        ROLLBACK;
        LEAVE initGame;
    END IF;

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    -- Проверка, является ли пользователь хостом лобби
    SELECT host_id INTO currentHostId FROM GameLobbies WHERE id = lobbyId;
    IF currentHostId != userId THEN
        SELECT 'Пользователь не является хостом лобби' AS error;
        ROLLBACK;
        LEAVE initGame;
    END IF;

    -- Проверка, что в лобби есть 4 игрока
    IF (SELECT COUNT(*) FROM UsersInLobby WHERE lobby_id = lobbyId) != 4 THEN
        SELECT 'В лобби должно быть 4 игрока' AS error;
        ROLLBACK;
        LEAVE initGame;
    END IF;

    -- Начата ли уже игра?
    IF EXISTS (SELECT 1 FROM CurrentTurn WHERE turn_player_id IN (SELECT id FROM Players WHERE lobby_id = lobbyId)) THEN
        SELECT 'Игра уже начата' AS error;
        ROLLBACK;
        LEAVE initGame;
    END IF;

    -- Все ли игроки готовы?
    IF (SELECT COUNT(*) FROM UsersInLobby WHERE lobby_id = lobbyId AND is_ready = 0) > 0 THEN
        SELECT 'Не все игроки готовы' AS error;
        ROLLBACK;
        LEAVE initGame;
    END IF;

    -- Инициализация игроков
    INSERT INTO Players (user_id, lobby_id)
    SELECT user_id, lobbyId
    FROM UsersInLobby
    WHERE lobby_id = lobbyId;

    -- Вставка карт для игры
    INSERT INTO Cards (`rank`, `suit`)
    VALUES ('A', 'H'),
           ('2', 'H'),
           ('3', 'H'),
           ('4', 'H'),
           ('5', 'H'),
           ('6', 'H'),
           ('7', 'H'),
           ('8', 'H'),
           ('9', 'H'),
           ('10', 'H'),
           ('J', 'H'),
           ('Q', 'H'),
           ('K', 'H'),
           ('A', 'D'),
           ('2', 'D'),
           ('3', 'D'),
           ('4', 'D'),
           ('5', 'D'),
           ('6', 'D'),
           ('7', 'D'),
           ('8', 'D'),
           ('9', 'D'),
           ('10', 'D'),
           ('J', 'D'),
           ('Q', 'D'),
           ('K', 'D'),
           ('A', 'C'),
           ('2', 'C'),
           ('3', 'C'),
           ('4', 'C'),
           ('5', 'C'),
           ('6', 'C'),
           ('7', 'C'),
           ('8', 'C'),
           ('9', 'C'),
           ('10', 'C'),
           ('J', 'C'),
           ('Q', 'C'),
           ('K', 'C'),
           ('A', 'S'),
           ('2', 'S'),
           ('3', 'S'),
           ('4', 'S'),
           ('5', 'S'),
           ('6', 'S'),
           ('7', 'S'),
           ('8', 'S'),
           ('9', 'S'),
           ('10', 'S'),
           ('J', 'S'),
           ('Q', 'S'),
           ('K', 'S');


    -- Перемешивание и раздача карт
    CREATE TEMPORARY TABLE LastCards
    SELECT * FROM Cards ORDER BY id DESC LIMIT 52;
    CREATE TEMPORARY TABLE RandomLastCards
    SELECT * FROM LastCards ORDER BY RAND();
    DROP TEMPORARY TABLE LastCards;

    -- Выделение id игроков
    CREATE TEMPORARY TABLE PlayerIDs AS
    SELECT id FROM Players WHERE lobby_id = lobbyId ORDER BY id;

    -- Раздача карт игрокам
    INSERT INTO PlayerCards (card_id, player_id)
    SELECT id, (SELECT id FROM PlayerIDs LIMIT 1 OFFSET 0)
    FROM RandomLastCards
    LIMIT 13 OFFSET 0;

    INSERT INTO PlayerCards (card_id, player_id)
    SELECT id, (SELECT id FROM PlayerIDs LIMIT 1 OFFSET 1)
    FROM RandomLastCards
    LIMIT 13 OFFSET 13;

    INSERT INTO PlayerCards (card_id, player_id)
    SELECT id, (SELECT id FROM PlayerIDs LIMIT 1 OFFSET 2)
    FROM RandomLastCards
    LIMIT 13 OFFSET 26;

    INSERT INTO PlayerCards (card_id, player_id)
    SELECT id, (SELECT id FROM PlayerIDs LIMIT 1 OFFSET 3)
    FROM RandomLastCards
    LIMIT 13 OFFSET 39;

    DROP TEMPORARY TABLE RandomLastCards;

    -- Определение кто будет ходить первым
    INSERT INTO CurrentTurn (turn_player_id, current_rank, start_time)
    SELECT id, 'A', NOW()
    FROM PlayerIDs
    ORDER BY RAND()
    LIMIT 1;

    UPDATE GameLobbies SET state = 'Turn' WHERE id = lobbyId;

    DROP TEMPORARY TABLE PlayerIDs;
    COMMIT;
END initGame;

DROP FUNCTION IF EXISTS isConfirming;
CREATE FUNCTION isConfirming(lobbyID INT) RETURNS BOOLEAN
    SQL SECURITY INVOKER
BEGIN
    RETURN EXISTS(SELECT 1
                  FROM PlayerConfirmations
                           JOIN Players on player_id = id
                  WHERE lobby_id = lobbyID);
END;

-- Сделать ход, параметры могут быть NULL
DROP PROCEDURE IF EXISTS makeMove;
CREATE PROCEDURE makeMove(token INT UNSIGNED, playerID INT, card1 INT, card2 INT, card3 INT, card4 INT)
    COMMENT 'Сделать ход. Параметры: playerID, card_id1, card_id2, card_id3, card_id4'
makeMove:
BEGIN
    DECLARE lobbyID INT;

    -- Проверка на валидность токена
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE makeMove;
    END IF;

    START TRANSACTION;

    SELECT 'makeMove' kmark;

    SELECT lobby_id INTO lobbyID FROM Players WHERE id = playerID;

    -- Проверка, является ли текущий игрок ходящим игроком
    IF NOT EXISTS (SELECT 1 FROM CurrentTurn WHERE turn_player_id = playerID) THEN
        SELECT 'Не ваш ход' AS error;
        ROLLBACK;
        LEAVE makeMove;
    END IF;



    -- Проверка, не сходил ли игрок уже
    IF (EXISTS (SELECT 1 FROM Checks WHERE turn_player_id = playerID) OR isConfirming(lobbyID)) THEN
        SELECT 'Вы уже сходили' AS error;
        ROLLBACK;
        LEAVE makeMove;
    END IF;

    -- Добавление карт в Turn Cards
    IF card1 IS NOT NULL THEN
        IF NOT EXISTS(SELECT 1 FROM PlayerCards WHERE player_id = playerID AND card_id = card1) THEN
            ROLLBACK;
            LEAVE makeMove;
        END IF;
        INSERT INTO TurnCards (card_id, turn_player_id)
        VALUES (card1, playerID);
    END IF;
    IF card2 IS NOT NULL THEN
        IF NOT EXISTS(SELECT 1 FROM PlayerCards WHERE player_id = playerID AND card_id = card2) THEN
            ROLLBACK;
            LEAVE makeMove;
        END IF;
        INSERT INTO TurnCards (card_id, turn_player_id)
        VALUES (card2, playerID);
    END IF;
    IF card3 IS NOT NULL THEN
        IF NOT EXISTS(SELECT 1 FROM PlayerCards WHERE player_id = playerID AND card_id = card3) THEN
            ROLLBACK;
            LEAVE makeMove;
        END IF;
        INSERT INTO TurnCards (card_id, turn_player_id)
        VALUES (card3, playerID);
    END IF;
    IF card4 IS NOT NULL THEN
        IF NOT EXISTS(SELECT 1 FROM PlayerCards WHERE player_id = playerID AND card_id = card4) THEN
            ROLLBACK;
            LEAVE makeMove;
        END IF;
        INSERT INTO TurnCards (card_id, turn_player_id)
        VALUES (card4, playerID);
    END IF;

    -- Удаление карт игрока, которые он использовал в этом ходу
    DELETE FROM PlayerCards WHERE player_id = playerID AND card_id IN (card1, card2, card3, card4);
    -- Создание проверки, чтобы все игроки увидели карты которыми сыграл игрок
    INSERT INTO PlayerConfirmations(player_id) SELECT id FROM Players WHERE lobby_id = lobbyID;

    SELECT 'makeMoveFinish';
    COMMIT;
END makeMove;

DROP FUNCTION IF EXISTS findNextPlayer;
-- Нахождение следующего игрока
CREATE FUNCTION findNextPlayer(currentPlayerId INT, lobbyId INT) RETURNS INT
    SQL SECURITY INVOKER
BEGIN
    DECLARE nextPlayerId INT;

    -- Поиск следующего игрока с большим id
    SELECT id
    INTO nextPlayerId
    FROM Players
    WHERE lobby_id = lobbyId
      AND id > currentPlayerId
    ORDER BY id
    LIMIT 1;

    -- Если такого игрока нет, выбираем первого по списку
    IF nextPlayerId IS NULL THEN
        SELECT id
        INTO nextPlayerId
        FROM Players
        WHERE lobby_id = lobbyId
        ORDER BY id
        LIMIT 1;
    END IF;

    RETURN nextPlayerId;
END;

DROP FUNCTION IF EXISTS findNextPlayerWithChecks;
-- Нахождение следующего игрока, который может проверить
CREATE FUNCTION findNextPlayerWithChecks(currentPlayerID INT, lobbyId INT) RETURNS INT
    SQL SECURITY INVOKER
BEGIN
    DECLARE nextPlayerId INT DEFAULT NULL;
    DECLARE checkerPlayer INT DEFAULT NULL;

    SELECT player_id
    INTO checkerPlayer
    FROM Checks
             JOIN Players ON Checks.player_id = Players.id
    WHERE lobby_id = lobbyId
    LIMIT 1;

    IF (checkerPlayer IS NULL) THEN
        RETURN findNextPlayer(currentPlayerID, lobbyId);
    ELSE
        SELECT id
        INTO nextPlayerId
        FROM Players
        WHERE lobby_id = lobbyId
          AND id > checkerPlayer
          AND checks_count > 0
        ORDER BY id
        LIMIT 1;

        IF nextPlayerId = currentPlayerId THEN
            RETURN NULL;
        END IF;

        -- Если такого игрока нет, ищем с начала списка
        IF nextPlayerId IS NULL THEN
            SELECT id
            INTO nextPlayerId
            FROM Players
            WHERE lobby_id = lobbyId
              AND checks_count > 0
              AND id != checkerPlayer
            ORDER BY id
            LIMIT 1;
        END IF;
    END IF;

    RETURN nextPlayerId;
END;

DROP PROCEDURE IF EXISTS passTurnToNextPlayer;
-- Передать ход другому игроку
CREATE PROCEDURE passTurnToNextPlayer(currentPlayerId INT, lobbyId INT, currentRank VARCHAR(2))
    SQL SECURITY INVOKER
BEGIN
    DECLARE nextPlayerId INT;
    -- Находим след игрока
    SET nextPlayerId = findNextPlayer(currentPlayerId, lobbyId);

    DELETE FROM CurrentTurn WHERE turn_player_id = currentPlayerId;
    INSERT CurrentTurn(turn_player_id, current_rank, start_time) VALUES (nextPlayerId, currentRank, NOW());
END;

DROP FUNCTION IF EXISTS getNextRank;
-- Изменить текущий номинал
CREATE FUNCTION getNextRank(lobbyID INT) RETURNS VARCHAR(2)
    SQL SECURITY INVOKER
BEGIN
    DECLARE currentRank ENUM ('A','2','3','4','5','6','7','8','9','10','J','Q','K');

    -- Получение текущего ранга
    SELECT current_rank
    INTO currentRank
    FROM CurrentTurn
             JOIN Players ON CurrentTurn.turn_player_id = Players.id
    WHERE Players.lobby_id = lobbyID
    LIMIT 1;

    -- Определение следующего ранга
    RETURN CASE currentRank
               WHEN 'A' THEN '2'
               WHEN '2' THEN '3'
               WHEN '3' THEN '4'
               WHEN '4' THEN '5'
               WHEN '5' THEN '6'
               WHEN '6' THEN '7'
               WHEN '7' THEN '8'
               WHEN '8' THEN '9'
               WHEN '9' THEN '10'
               WHEN '10' THEN 'J'
               WHEN 'J' THEN 'Q'
               WHEN 'Q' THEN 'K'
               WHEN 'K' THEN 'A'
        END;
END;


DROP PROCEDURE IF EXISTS declineCheckBluff;
-- Отклонить проверку
CREATE PROCEDURE declineCheckBluff(token INT UNSIGNED, checkerID INT, turnPlayerID INT)
    COMMENT 'Отказаться от проверки игрока. Параметры: userToken, checkerID, turnPlayerID'
declineCheckBluff:
BEGIN
    DECLARE lobbyID INT;
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);

    START TRANSACTION;

    SELECT 'declineCheckBluff' kmark;

    -- Проверка на валидность токена
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        ROLLBACK;
        LEAVE declineCheckBluff;
    END IF;

    -- Проверяем, есть ли проверка у этого игрока?
    -- из таблицы Checks
    IF (NOT EXISTS (SELECT 1 FROM Checks WHERE player_id = checkerID AND turn_player_id = turnPlayerID) OR
        isConfirming(lobbyID)) THEN
        SELECT 'У вас нет права на проверку' AS error;
        ROLLBACK;
        LEAVE declineCheckBluff;
    END IF;

    -- Получение ID лобби
    SELECT lobby_id INTO lobbyID FROM Players WHERE id = checkerID;

    -- Создание проверки, чтобы все игроки увидели что игрок думает
    INSERT INTO PlayerConfirmations(player_id) SELECT id FROM Players WHERE lobby_id = lobbyID;
    COMMIT;

END declineCheckBluff;

DROP PROCEDURE IF EXISTS checkBluff;
-- Проверить сходивщего игрока
CREATE PROCEDURE checkBluff(token INT UNSIGNED, checkerID INT, turnPlayerID INT)
    COMMENT 'Проверка на блеф. Параметры: userToken, checkerID, turnPlayerID'
checkBluff:
BEGIN
    DECLARE currentRank ENUM ('A','2','3','4','5','6','7','8','9','10','J','Q','K');
    DECLARE lobbyID INT;
    DECLARE checkTime INT;
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);

    START TRANSACTION;
    SELECT 'checkBluff' kmark;
    -- Проверка на валидность токена
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        ROLLBACK;
        LEAVE checkBluff;
    END IF;

    -- Проверяем, есть ли проверка у этого игрока?
    -- из таблицы Checks
    IF (NOT EXISTS (SELECT 1 FROM Checks WHERE player_id = checkerID AND turn_player_id = turnPlayerID) or
        isConfirming(lobbyID)) THEN
        SELECT 'У вас нет права на проверку' AS error;
        ROLLBACK;
        LEAVE checkBluff;
    END IF;

    -- Берем lobbyId и checkTime
    SELECT lobby_id, check_time
    INTO lobbyID, checkTime
    FROM GameLobbies
             JOIN Players ON GameLobbies.id = Players.lobby_id
    WHERE Players.id = checkerID;

    -- Получение текущего ранга карты
    SELECT current_rank INTO currentRank FROM CurrentTurn WHERE turn_player_id = turnPlayerID;

    UPDATE GameLobbies SET state = 'Checking' WHERE id = lobbyID;

    -- Создание проверки, чтобы все игроки увидели результат проверки
    INSERT INTO PlayerConfirmations(player_id) SELECT id FROM Players WHERE lobby_id = lobbyID;
    COMMIT;

END checkBluff;

DROP PROCEDURE IF EXISTS updateGameInfo;
-- Вывод текущего состояния игры
CREATE PROCEDURE updateGameInfo(token INT UNSIGNED, lobbyID INT)
    COMMENT 'Обновление информации о игре. Параметры: lobbyID'
updateGameInfo:
BEGIN
    DECLARE currentPlayerID INT;
    DECLARE currentRank ENUM ('A','2','3','4','5','6','7','8','9','10','J','Q','K');
    DECLARE cardsOnTableCount INT;
    DECLARE cardsPlayedCount INT;
    DECLARE nextPlayerID INT;
    DECLARE checkerID INT;
    DECLARE checkResult VARCHAR(20);
    DECLARE userId INT;
    DECLARE playerID INT;
    DECLARE v_state VARCHAR(20);

    -- Проверка на валидность токена
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE updateGameInfo;
    END IF;

    -- Есть ли такое лобби?
    IF NOT EXISTS (SELECT 1 FROM GameLobbies WHERE id = lobbyID) THEN
        SELECT 'Игры не существует' AS error;
        LEAVE updateGameInfo;
    END IF;

    -- Начата ли игра?
    -- Берем все id игроков в лобби, и если какой-то игрок находится в turn_player_id, значит игра уже начата.
    IF NOT EXISTS (SELECT 1
                   FROM CurrentTurn
                   WHERE turn_player_id IN (SELECT id FROM Players WHERE lobby_id = lobbyId)) THEN
        SELECT 'Игра еще не начата' AS error;
        LEAVE updateGameInfo;
    END IF;


    UPDATE UsersInLobby SET last_activity_time = NOW() WHERE user_id = userId AND lobby_id = lobbyID;

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;
    -- Получение player_id, связанного с userId
    SELECT id INTO playerID FROM Players WHERE user_id = userId AND lobby_id = lobbyID;

    -- Есть ли ожидание потверждения от игрока?

    -- Получение id текущего игрока и текущего номинала
    SELECT turn_player_id, current_rank
    INTO currentPlayerID, currentRank
    FROM CurrentTurn
             JOIN Players ON CurrentTurn.turn_player_id = Players.id
    WHERE Players.lobby_id = lobbyID;


    -- Кол-во карт на столе
    SELECT COUNT(*) INTO cardsOnTableCount FROM TableCards WHERE lobby_id = lobbyID;

    -- Кол-во карт которыеми сходил текущий игрок
    SELECT COUNT(*) INTO cardsPlayedCount FROM TurnCards WHERE turn_player_id = currentPlayerID;

    -- Cлед игрок
    SET nextPlayerID = findNextPlayer(currentPlayerID, lobbyID);

    -- Кто делает проверку
    SELECT player_id
    INTO checkerID
    FROM Checks
    WHERE turn_player_id = currentPlayerID
    LIMIT 1;

    -- Смотрю Checks, смотрю есть ли там какой то игрок из этого лобби
    -- Смотрим в PlayerConfirm

    -- Проверка результата проверки, если она была
    IF checkerID IS NOT NULL THEN
        SET checkResult = 'Ожидается проверка';
    ELSE
        SET checkResult = 'Нет проверок';
    END IF;

    -- Вывод инфы
    SELECT playerID,
           currentPlayerID,
           currentRank,
           cardsOnTableCount,
           cardsPlayedCount,
           nextPlayerID,
           checkerID,
           checkResult,
           isConfirming(lobbyID) AS isConfirming;

    IF EXISTS(SELECT 1 FROM PlayerConfirmations WHERE player_id = playerID) THEN
        -- Если есть то удаляем
        DELETE FROM PlayerConfirmations WHERE player_id = playerID;
        -- Если она последняя то делаем ключевое действие
        IF NOT EXISTS(SELECT 1
                      FROM PlayerConfirmations
                               JOIN Players on Players.id = player_id) THEN


            SELECT 'Inside';
            -- Просмотр карта хода
            SELECT state INTO v_state FROM GameLobbies WHERE id = lobbyID;

            SELECT v_state;

            IF (v_state = 'Checking') THEN
                CALL confirmChecking(currentPlayerID, checkerID, currentRank, lobbyID);
            END IF;
            IF (v_state = 'Finish') THEN
                CALL confirmFinish(currentPlayerID, lobbyID);
            END IF;
            IF (v_state = 'Turn') THEN
                CALL confirmTurn(currentPlayerID, lobbyID);
            END IF;
            IF (v_state = 'Check Accepting') THEN
                CALL confirmDeclineChecking(currentPlayerID, checkerID, lobbyID);
            end if;
        END IF;
    END IF;
END updateGameInfo;

DROP PROCEDURE IF EXISTS confirmFinish;
CREATE PROCEDURE confirmFinish(turnPlayerID INT, lobbyID INT)
    SQL SECURITY INVOKER
BEGIN
    SELECT 'confirmFinish' kmark;
    DELETE FROM GameLobbies WHERE id = lobbyID;
    UPDATE Users JOIN Players on Users.id = Players.user_id
    SET win_count = win_count + 1
    WHERE Players.id = turnPlayerID;
END;


DROP PROCEDURE IF EXISTS confirmTurn;
CREATE PROCEDURE confirmTurn(turnPlayerID INT, lobbyID INT)
    SQL SECURITY INVOKER
this:
BEGIN

    DECLARE nextPlayerID INT DEFAULT findNextPlayerWithChecks(turnPlayerID, lobbyID);
    SELECT nextPlayerID;
    SELECT 'confirmTurn' as kmark;
    IF (nextPlayerID IS NULL) THEN
        SELECT 'nextPlayerID is null';
        -- Карт в руке нет значит он победил
        IF NOT EXISTS(SELECT 1 FROM PlayerCards WHERE player_id = turnPlayerID) THEN
            SELECT 'finish';
            UPDATE GameLobbies SET state = 'Finish' WHERE id = lobbyID;
            INSERT INTO PlayerConfirmations(player_id) SELECT id FROM Players WHERE lobby_id = lobbyID;
            LEAVE this;
        END IF;

        SELECT 'moveNext';
        INSERT INTO TableCards (card_id, lobby_id)
        SELECT card_id, lobbyID
        FROM TurnCards
        WHERE turn_player_id = turnPlayerID;
        DELETE FROM TurnCards WHERE turn_player_id = turnPlayerID;
        CALL passTurnToNextPlayer(turnPlayerID, lobbyID, getNextRank(lobbyID));
        LEAVE this;
    END IF;

    SELECT 'createCheck';
    INSERT INTO Checks (player_id, turn_player_id, start_time) VALUES (nextPlayerId, turnPlayerID, NOW());
    UPDATE GameLobbies SET state = 'Check Accepting' WHERE id = lobbyID;
END;

DROP PROCEDURE IF EXISTS confirmDeclineChecking;
CREATE PROCEDURE confirmDeclineChecking(turnPlayerID INT, checkerPlayerID INT, lobbyID INT)
    SQL SECURITY INVOKER
this:
BEGIN
    DECLARE nextPlayerID INT;

    -- Находим следующего игрока с доступными проверками
    SELECT 'confirmDeclineChecking' as kmark;
    SET nextPlayerId = findNextPlayerWithChecks(turnPlayerID, lobbyID);
    DELETE FROM Checks WHERE player_id = checkerPlayerID;

    SELECT nextPlayerID;
    IF (nextPlayerID IS NULL) THEN
        -- Карт в руке нет значит он победил
        IF NOT EXISTS(SELECT 1 FROM PlayerCards WHERE player_id = turnPlayerID) THEN
            UPDATE GameLobbies SET state = 'Finish' WHERE id = lobbyID;
            INSERT INTO PlayerConfirmations(player_id) SELECT id FROM Players WHERE lobby_id = lobbyID;
            LEAVE this;
        END IF;

        INSERT INTO TableCards (card_id, lobby_id)
        SELECT card_id, lobbyID
        FROM TurnCards
        WHERE turn_player_id = turnPlayerID;
        DELETE FROM TurnCards WHERE turn_player_id = turnPlayerID;
        CALL passTurnToNextPlayer(turnPlayerID, lobbyID, getNextRank(lobbyID));
        UPDATE GameLobbies SET state = 'Turn' WHERE id = lobbyID;
        LEAVE this;
    END IF;

    INSERT INTO Checks (player_id, turn_player_id, start_time)
    VALUES (nextPlayerId, turnPlayerID, NOW());
    UPDATE GameLobbies SET state = 'Check Accepting' WHERE id = lobbyID;
END;

DROP PROCEDURE IF EXISTS confirmChecking;
CREATE PROCEDURE confirmChecking(turnPlayerID INT, checkerPlayerID INT, currentRank INT, lobbyID INT)
    SQL SECURITY INVOKER
BEGIN
    DECLARE bluffDetected BOOLEAN;
    DECLARE losePlayer INT;
    SELECT 'confirmChecking' as kmark;

    -- Определение, врал ли игрок
    SET bluffDetected = EXISTS(SELECT 1
                               FROM TurnCards
                                        JOIN Cards ON TurnCards.card_id = Cards.id
                               WHERE turn_player_id = turnPlayerID
                                 AND Cards.rank != currentRank);

    IF (bluffDetected) THEN
        SET losePlayer = turnPlayerID;
    ELSE
        SET losePlayer = checkerPlayerID;
    END IF;

    INSERT INTO PlayerCards (player_id, card_id)
    SELECT losePlayer, card_id
    FROM TurnCards
    WHERE turn_player_id = turnPlayerID;

    INSERT INTO PlayerCards (player_id, card_id)
    SELECT losePlayer, card_id
    FROM TableCards
    WHERE lobby_id = lobbyID;


    IF bluffDetected THEN
        DELETE FROM CurrentTurn WHERE turn_player_id = turnPlayerID;
        INSERT INTO CurrentTurn(start_time, current_rank, turn_player_id) VALUES (NOW(), currentRank, checkerPlayerID);
    ELSE
        UPDATE Players SET checks_count = checks_count - 1 WHERE id = checkerPlayerID;
        CALL passTurnToNextPlayer(turnPlayerID, lobbyID, getNextRank(lobbyID));
    END IF;


    -- Удаление всех карт из TurnCards и TableCards для текущего лобби
    DELETE FROM TurnCards WHERE turn_player_id = turnPlayerID;
    DELETE FROM TableCards WHERE lobby_id = lobbyID;
    -- Удаление проверки из таблицы Checks
    DELETE FROM Checks WHERE player_id = checkerPlayerID;

    UPDATE GameLobbies SET state = 'Turn' WHERE id = lobbyID;
END;

DROP PROCEDURE IF EXISTS getPlayerCards;
-- Вывести карты игрока
CREATE PROCEDURE getPlayerCards(token INT UNSIGNED, lobbyId INT)
    COMMENT 'Получить карты игрока. Параметры: userToken, lobbyId'
getPlayerCards:
BEGIN

    DECLARE userId INT;
    -- Проверка на валидность токена
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE getPlayerCards;
    END IF;

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    SELECT card_id, `rank`, `suit`
    FROM PlayerCards
             JOIN Cards ON PlayerCards.card_id = Cards.id
    WHERE player_id = (SELECT id FROM Players WHERE user_id = userId AND lobby_id = lobbyId);
END;

DROP PROCEDURE IF EXISTS getPlayersInLobby;
-- Получить текущих игроков и кол-во их карт
CREATE PROCEDURE getPlayersInLobby(token INT UNSIGNED, lobbyID INT)
    COMMENT 'Получить игроков в лобби и кол-во карт в их руках. Параметр: lobbyID'
getPlayersInLobby:
BEGIN
    -- Проверка на валидность токена
    DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE getPlayersInLobby;
    END IF;

    -- Запрос
    SELECT p.id AS player_id, u.login, COUNT(pc.card_id) AS card_count
    FROM Players p
             JOIN Users u ON p.user_id = u.id
             LEFT JOIN PlayerCards pc ON p.id = pc.player_id
    WHERE p.lobby_id = lobbyID
    GROUP BY p.id, u.login;
END getPlayersInLobby;


-- Включить автоматическую игру игроку
-- Когда человек вышел из текущей игры
CREATE PROCEDURE setAutoPlay(token INT UNSIGNED, player_id INT)
    COMMENT 'Включить автоматическую игру.'
BEGIN
    -- check token
    -- set auto play = 1 to playerID
END;

-- Выключить автоматическую игру игроку
-- Когда человек зашел обратно в игру
CREATE PROCEDURE setAutoPlay(token INT UNSIGNED, player_id INT)
    COMMENT 'Выключить автоматическую игру.'
BEGIN
    -- check token
    -- set auto play = 0 to playerID
END;

-- Проверить autoPlay
-- На сервере просто буду проверять есть ли auto_play у игрока
-- Если есть, сразу выдаем MakeMove с рандомными картами
-- Если нет, ставим таймер и ждем.
CREATE FUNCTION getAutoPlay(player_id INT UNSIGNED)
    RETURNS BOOL
    COMMENT 'Проверить автоматическую игру.'
BEGIN
    -- check token
    -- set auto play = 0 to playerID
END;