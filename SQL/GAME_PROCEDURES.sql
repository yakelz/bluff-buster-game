-- Начало игры
CREATE PROCEDURE initGame(lobbyID INT)
COMMENT 'Инициализация игры. Параметры: lobbyID'
BEGIN
    -- Проверка, что в лобби есть 4 игрока
    IF (SELECT COUNT(*) FROM UsersInLobby WHERE lobby_id = lobbyID) != 4 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'В лобби должно быть 4 игрока';
    END IF;

    -- Начата ли уже игра?
    -- Берем все id игроков в лобби, и если какой-то игрок находится в turn_player_id, значит игра уже начата.
    IF EXISTS (SELECT 1 FROM CurrentTurn WHERE turn_player_id IN (SELECT id FROM Players WHERE lobby_id = lobbyID)) THEN
        -- Можно использовать так вообще?
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Игра уже начата';
    END IF;

    -- Инициализация игроков
    CREATE TEMPORARY TABLE lobbyUsers SELECT user_id FROM UsersInLobby WHERE lobby_id = lobbyID;
    INSERT INTO Players(user_id, lobby_id)
        SELECT user_id, lobbyID FROM lobbyUsers;
    DROP TEMPORARY TABLE lobbyUsers;

    -- Вставка карт для игры
    INSERT INTO Cards (`rank`) VALUES
        ('A'), ('2'), ('3'), ('4'), ('5'), ('6'), ('7'), ('8'), ('9'), ('10'), ('J'), ('Q'), ('K'),
        ('A'), ('2'), ('3'), ('4'), ('5'), ('6'), ('7'), ('8'), ('9'), ('10'), ('J'), ('Q'), ('K'),
        ('A'), ('2'), ('3'), ('4'), ('5'), ('6'), ('7'), ('8'), ('9'), ('10'), ('J'), ('Q'), ('K'),
        ('A'), ('2'), ('3'), ('4'), ('5'), ('6'), ('7'), ('8'), ('9'), ('10'), ('J'), ('Q'), ('K');
    -- Перемешивание и раздача карт
    CREATE TEMPORARY TABLE LastCards SELECT * FROM Cards ORDER BY id DESC LIMIT 52;
    CREATE TEMPORARY TABLE RandomLastCards AS SELECT * FROM LastCards ORDER BY RAND();
    DROP TEMPORARY TABLE LastCards;

    -- Выделение id игроков
    CREATE TEMPORARY TABLE PlayerIDs AS
        SELECT id FROM Players WHERE lobby_id = lobbyID ORDER BY id;

    -- Раздача карт игрокам
    INSERT INTO PlayerCards (card_id, player_id)
        SELECT id, (SELECT id FROM PlayerIDs LIMIT 1 OFFSET 0)
        FROM RandomLastCards LIMIT 13 OFFSET 0;

    INSERT INTO PlayerCards (card_id, player_id)
        SELECT id, (SELECT id FROM PlayerIDs LIMIT 1 OFFSET 1)
        FROM RandomLastCards LIMIT 13 OFFSET 13;

    INSERT INTO PlayerCards (card_id, player_id)
        SELECT id, (SELECT id FROM PlayerIDs LIMIT 1 OFFSET 2)
        FROM RandomLastCards LIMIT 13 OFFSET 26;

    INSERT INTO PlayerCards (card_id, player_id)
        SELECT id, (SELECT id FROM PlayerIDs LIMIT 1 OFFSET 3)
        FROM RandomLastCards LIMIT 13 OFFSET 39;

    DROP TEMPORARY TABLE RandomLastCards;

    -- Определение кто будет ходить первым
    INSERT INTO CurrentTurn (turn_player_id, current_rank, start_time)
        SELECT id, 'A', NOW() FROM PlayerIDs ORDER BY RAND() LIMIT 1;

    DROP TEMPORARY TABLE PlayerIDs;
END;

-- Сделать ход, параметры могут быть NULL
CREATE PROCEDURE makeMove(playerID INT, card1 INT, card2 INT, card3 INT, card4 INT)
COMMENT 'Сделать ход. Параметры: playerID, card_id1, card_id2, card_id3, card_id4'
BEGIN
    DECLARE lobbyID INT;
    SELECT lobby_id INTO lobbyID FROM Players WHERE id = playerID;

    -- Проверка, является ли текущий игрок ходящим игроком
    IF NOT EXISTS (SELECT 1 FROM CurrentTurn WHERE turn_player_id = playerID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Не ваш ход';
    END IF;

    -- Удаление карт игрока, которые он использовал в этом ходу
    IF card1 IS NOT NULL THEN
        DELETE FROM PlayerCards WHERE player_id = playerID AND card_id = card1;
    END IF;
    IF card2 IS NOT NULL THEN
        DELETE FROM PlayerCards WHERE player_id = playerID AND card_id = card2;
    END IF;
    IF card3 IS NOT NULL THEN
        DELETE FROM PlayerCards WHERE player_id = playerID AND card_id = card3;
    END IF;
    IF card4 IS NOT NULL THEN
        DELETE FROM PlayerCards WHERE player_id = playerID AND card_id = card4;
    END IF;

    -- Добавление карт в Turn Cards
    IF card1 IS NOT NULL THEN
        INSERT INTO TurnCards (card_id, turn_player_id)
            VALUES (card1, playerID);
    END IF;
    IF card2 IS NOT NULL THEN
        INSERT INTO TurnCards (card_id, turn_player_id)
            VALUES (card2, playerID);
    END IF;
    IF card3 IS NOT NULL THEN
        INSERT INTO TurnCards (card_id, turn_player_id)
            VALUES (card3, playerID);
    END IF;
    IF card4 IS NOT NULL THEN
        INSERT INTO TurnCards (card_id, turn_player_id)
            VALUES (card4, playerID);
    END IF;

    -- Предложение игрокам сделать проверку

    -- Надо дать след игроку проверку
        -- Проверяем есть ли него checks_count
        -- Если есть
            -- Подождать его ответа?
        -- Если нет дать проверку следующему

    -- Положить карты из TurnCards в TableCards
END;

-- Проверить сходивщего игрока
CREATE PROCEDURE сheckBluff(token INT UNSIGNED, checkerID INT, turnPlayerID INT)
COMMENT 'Проверка на блеф. Параметры: checkerID, turnPlayerID'
BEGIN
    -- Проверяем карты из TurnCards


    -- Если игрок не врал
        -- Карты из TurnCards идут в Player Cards (checkerID)
        -- Карты из TableCards идут в Player Cards (checkerID)
        -- из Player(checkerID) -1 из check_Count

    -- Если игрок врал
        -- Карты из TurnCards идут в Player Cards (turnPlayerID)
        -- Карты из TableCards идут в Player Cards (turnPlayerID)
END;

-- Вывод текущего состояния игры
CREATE PROCEDURE updateGameInfo(token INT UNSIGNED, lobbyID INT)
COMMENT 'Обновление информации о игре. Параметры: lobbyID'
BEGIN
    -- Карты на руке игрока
    -- текущий номинал
    -- сколько карт на столе,
    -- сколько карт игрок сходил
    -- кто следующий игрок,
    -- кто проверяет
        -- результат проверки
END;

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