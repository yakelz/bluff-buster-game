-- Начало игры
CREATE PROCEDURE initGame(token INT UNSIGNED, lobbyId INT)
COMMENT 'Инициализация игры. Параметры: userToken, lobbyID'
initGame:BEGIN
    DECLARE currentHostId INT;

    -- Проверка на валидность токена
    DECLARE userId INT;
	DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE initGame;
    END IF;

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    -- Проверка, является ли пользователь хостом лобби
    -- Берем id хоста
    SELECT host_id INTO currentHostId FROM GameLobbies WHERE id = lobbyId;
    IF currentHostId != userId THEN
        SELECT 'Пользователь не является хостом лобби' AS error;
        LEAVE initGame;
    END IF;

    -- Проверка, что в лобби есть 4 игрока
    IF (SELECT COUNT(*) FROM UsersInLobby WHERE lobby_id = lobbyId) != 4 THEN
        SELECT 'В лобби должно быть 4 игрока' AS error;
        LEAVE initGame;
    END IF;

    -- Начата ли уже игра?
    -- Берем все id игроков в лобби, и если какой-то игрок находится в turn_player_id, значит игра уже начата.
    IF EXISTS (SELECT 1 FROM CurrentTurn WHERE turn_player_id IN (SELECT id FROM Players WHERE lobby_id = lobbyId)) THEN
        SELECT 'Игра уже начата' AS error;
        LEAVE initGame;
    END IF;

    -- Все ли игроки готовы?
    IF (SELECT COUNT(*) FROM UsersInLobby WHERE lobby_id = lobbyId AND is_ready = 0) > 0 THEN
        SELECT 'Не все игроки готовы' AS error;
        LEAVE initGame;
    END IF;

    -- Инициализация игроков
    INSERT INTO Players (user_id, lobby_id)
        SELECT user_id, lobbyId FROM UsersInLobby WHERE lobby_id = lobbyId;

    -- Вставка карт для игры
    INSERT INTO Cards (`rank`, `suit`) VALUES
    ('A', 'H'), ('2', 'H'), ('3', 'H'), ('4', 'H'), ('5', 'H'), ('6', 'H'), ('7', 'H'), ('8', 'H'), ('9', 'H'), ('10', 'H'), ('J', 'H'), ('Q', 'H'), ('K', 'H'),
    ('A', 'D'), ('2', 'D'), ('3', 'D'), ('4', 'D'), ('5', 'D'), ('6', 'D'), ('7', 'D'), ('8', 'D'), ('9', 'D'), ('10', 'D'), ('J', 'D'), ('Q', 'D'), ('K', 'D'),
    ('A', 'C'), ('2', 'C'), ('3', 'C'), ('4', 'C'), ('5', 'C'), ('6', 'C'), ('7', 'C'), ('8', 'C'), ('9', 'C'), ('10', 'C'), ('J', 'C'), ('Q', 'C'), ('K', 'C'),
    ('A', 'S'), ('2', 'S'), ('3', 'S'), ('4', 'S'), ('5', 'S'), ('6', 'S'), ('7', 'S'), ('8', 'S'), ('9', 'S'), ('10', 'S'), ('J', 'S'), ('Q', 'S'), ('K', 'S');


    -- Перемешивание и раздача карт
    CREATE TEMPORARY TABLE LastCards SELECT * FROM Cards ORDER BY id DESC LIMIT 52;
    CREATE TEMPORARY TABLE RandomLastCards SELECT * FROM LastCards ORDER BY RAND();
    DROP TEMPORARY TABLE LastCards;

    -- Выделение id игроков
    CREATE TEMPORARY TABLE PlayerIDs AS
        SELECT id FROM Players WHERE lobby_id = lobbyId ORDER BY id;

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
END initGame;

-- Сделать ход, параметры могут быть NULL
CREATE PROCEDURE makeMove(token INT UNSIGNED, playerID INT, card1 INT, card2 INT, card3 INT, card4 INT)
COMMENT 'Сделать ход. Параметры: playerID, card_id1, card_id2, card_id3, card_id4'
makeMove:BEGIN
    DECLARE lobbyID INT;
    DECLARE nextPlayerId INT;

    -- Проверка на валидность токена
	DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE makeMove;
    END IF;

    SELECT lobby_id INTO lobbyID FROM Players WHERE id = playerID;

    -- Проверка, является ли текущий игрок ходящим игроком
    IF NOT EXISTS (SELECT 1 FROM CurrentTurn WHERE turn_player_id = playerID) THEN
        SELECT 'Не ваш ход' AS error;
        LEAVE makeMove;
    END IF;

    -- Удаление карт игрока, которые он использовал в этом ходу
     DELETE FROM PlayerCards WHERE player_id = playerID AND card_id IN (card1, card2, card3, card4);

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

    -- Находим след игрока, которому предлагаем проверить
    SET nextPlayerId = findNextPlayerWithChecks(playerID, lobbyID);

    -- Если найден игрок для проверки
    IF nextPlayerId IS NOT NULL THEN
        -- Создаем предложение для проверки
        INSERT INTO Checks (player_id, turn_player_id, start_time)
            VALUES (nextPlayerId, playerID, NOW());
    ELSE
        -- Если никто не может проверить, проверяем, есть ли у игрока еще карты в руке
        -- Если нет, тогда
            -- Игрок выигрывает
        -- Если есть, тогда
        -- Передаем ход следующему игроку
        CALL passTurnToNextPlayer(playerID, lobbyID);
    END IF;
END makeMove;

-- Нахождение следующего игрока
CREATE FUNCTION findNextPlayer(currentPlayerId INT, lobbyId INT) RETURNS INT
BEGIN
    DECLARE nextPlayerId INT DEFAULT NULL;

    -- Поиск следующего игрока с большим id
    SELECT id INTO nextPlayerId
        FROM Players
        WHERE lobby_id = lobbyId AND id > currentPlayerId
        ORDER BY id
        LIMIT 1;

    -- Если такого игрока нет, выбираем первого по списку
    IF nextPlayerId IS NULL THEN
        SELECT id INTO nextPlayerId
            FROM Players
            WHERE lobby_id = lobbyId
            ORDER BY id
            LIMIT 1;
    END IF;

    RETURN nextPlayerId;
END;

-- Нахождение следующего игрока, который может проверить
CREATE FUNCTION findNextPlayerWithChecks(currentPlayerId INT, lobbyId INT) RETURNS INT
BEGIN
    DECLARE nextPlayerId INT DEFAULT NULL;

    -- Поиск следующего игрока с большим id и доступными проверками
    SELECT id INTO nextPlayerId
    FROM Players
    WHERE lobby_id = lobbyId AND id > currentPlayerId AND checks_count > 0
    ORDER BY id
    LIMIT 1;

    -- Если такого игрока нет, ищем с начала списка
    IF nextPlayerId IS NULL THEN
        SELECT id INTO nextPlayerId
        FROM Players
        WHERE lobby_id = lobbyId AND checks_count > 0 AND id <> currentPlayerId
        ORDER BY id
        LIMIT 1;
    END IF;

    RETURN nextPlayerId;
END;

-- Передать ход другому игроку
CREATE PROCEDURE passTurnToNextPlayer(currentPlayerId INT, lobbyId INT)
BEGIN
    DECLARE nextPlayerId INT;

    -- Находим след игрока
    SET nextPlayerId = findNextPlayer(currentPlayerId, lobbyId);

    -- Обновляем в CurrentTurn
    UPDATE CurrentTurn SET turn_player_id = nextPlayerId WHERE turn_player_id = currentPlayerId;
END;



-- Отклонить проверку
CREATE PROCEDURE declineCheckBluff(token INT UNSIGNED, checkerID INT, turnPlayerID INT)
COMMENT 'Отказаться от проверки игрока. Параметры: userToken, checkerID, turnPlayerID'
declineCheckBluff: BEGIN
    DECLARE lobbyID INT;
    DECLARE nextPlayerId INT;

    -- Проверка на валидность токена
	DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE declineCheckBluff;
    END IF;

    -- Проверяем, есть ли проверка у этого игрока?
    -- из таблицы Checks
    IF NOT EXISTS (SELECT 1 FROM Checks WHERE player_id = checkerID AND turn_player_id = turnPlayerID) THEN
        SELECT 'У вас нет права на проверку' AS error;
        LEAVE declineCheckBluff;
    END IF;

    -- Получение ID лобби
    SELECT lobby_id INTO lobbyID FROM Players WHERE id = checkerID;

    -- Удаление текущего запроса на проверку
    DELETE FROM Checks WHERE player_id = checkerID AND turn_player_id = turnPlayerID;

    -- Находим следующего игрока с доступными проверками
    SET nextPlayerId = findNextPlayerWithChecks(checkerID, lobbyID);

    -- Если найден игрок для проверки
    IF nextPlayerId IS NULL OR nextPlayerId = turnPlayerID THEN
        -- Если никто не может проверить, передаем ход следующему игроку
        CALL passTurnToNextPlayer(turnPlayerID, lobbyID);
    ELSE
        -- Создаем предложение для проверки
        INSERT INTO Checks (player_id, turn_player_id, start_time)
            VALUES (nextPlayerId, turnPlayerID, NOW());
    END IF;


END declineCheckBluff;


-- Проверить сходивщего игрока
CREATE PROCEDURE сheckBluff(token INT UNSIGNED, checkerID INT, turnPlayerID INT)
COMMENT 'Проверка на блеф. Параметры: userToken, checkerID, turnPlayerID'
checkBluff: BEGIN

    DECLARE currentRank ENUM('A','2','3','4','5','6','7','8','9','10','J','Q','K');
    DECLARE bluffDetected BOOLEAN;
    DECLARE cardCount INT;
    DECLARE checkStartTime DATETIME;
    DECLARE lobbyID INT;
    DECLARE checkTime INT;
    DECLARE timeElapsed INT;

    -- Проверка на валидность токена
	DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE checkBluff;
    END IF;

    -- Проверяем, есть ли проверка у этого игрока?
    -- из таблицы Checks
    IF NOT EXISTS (SELECT 1 FROM Checks WHERE player_id = checkerID AND turn_player_id = turnPlayerID) THEN
        SELECT 'У вас нет права на проверку' AS error;
        LEAVE checkBluff;
    END IF;

    -- Берем lobbyId и checkTime
    SELECT lobby_id, check_time INTO lobbyID, checkTime
        FROM GameLobbies
        JOIN Players ON GameLobbies.id = Players.lobby_id
        WHERE Players.id = checkerID;

    -- Берем start_time проверки
    SELECT start_time INTO checkStartTime
        FROM Checks
        WHERE player_id = checkerID AND turn_player_id = turnPlayerID;

    -- Проверка, истекло ли время на проверку
    SELECT TIMESTAMPDIFF(SECOND, checkStartTime, NOW()) INTO timeElapsed;

    IF (timeElapsed > checkTime) THEN
        -- Если время истекло, автоматический отказ от проверки
        CALL declineCheckBluff(token, checkerID, turnPlayerID);
        LEAVE checkBluff;
    END IF;

    -- Если есть время, проверяем игрока:

    -- Получение текущего ранга карты
    SELECT current_rank INTO currentRank FROM CurrentTurn WHERE turn_player_id = turnPlayerID;

    -- Проверка количества карт в TurnCards, не соответствующих текущему рангу
    SELECT COUNT(*) INTO cardCount
    FROM TurnCards
    JOIN Cards ON TurnCards.card_id = Cards.id
    WHERE turn_player_id = turnPlayerID AND Cards.rank != currentRank;

    -- Определение, врал ли игрок
    SET bluffDetected = cardCount > 0;

    IF bluffDetected THEN
        -- Если игрок врал
        -- Перемещение карт из TurnCards и TableCards в PlayerCards (turnPlayerID)
        INSERT INTO PlayerCards (player_id, card_id)
        SELECT turnPlayerID, card_id FROM TurnCards WHERE turn_player_id = turnPlayerID;
        INSERT INTO PlayerCards (player_id, card_id)
        SELECT turnPlayerID, card_id FROM TableCards WHERE lobby_id = (SELECT lobby_id FROM Players WHERE id = turnPlayerID);
    ELSE
        -- Если игрок не врал
        -- Перемещение карт из TurnCards и TableCards в PlayerCards (checkerID)
        INSERT INTO PlayerCards (player_id, card_id)
        SELECT checkerID, card_id FROM TurnCards WHERE turn_player_id = turnPlayerID;
        INSERT INTO PlayerCards (player_id, card_id)
        SELECT checkerID, card_id FROM TableCards WHERE lobby_id = (SELECT lobby_id FROM Players WHERE id = checkerID);

        -- Уменьшение checks_Count у checkerID
        UPDATE Players SET checks_count = checks_count - 1 WHERE id = checkerID;
    END IF;

    -- Удаление всех карт из TurnCards и TableCards для текущего лобби
    DELETE FROM TurnCards WHERE turn_player_id = turnPlayerID;
    DELETE FROM TableCards WHERE lobby_id = (SELECT lobby_id FROM Players WHERE id = turnPlayerID);
    -- Удаление проверки из таблицы Checks
    DELETE FROM Checks WHERE player_id = checkerID AND turn_player_id = turnPlayerID;

END checkBluff;

-- Вывод текущего состояния игры
CREATE PROCEDURE updateGameInfo(token INT UNSIGNED, lobbyID INT)
COMMENT 'Обновление информации о игре. Параметры: lobbyID'
updateGameInfo: BEGIN
    DECLARE currentPlayerID INT;
    DECLARE currentRank ENUM('A','2','3','4','5','6','7','8','9','10','J','Q','K');
    DECLARE cardsOnTableCount INT;
    DECLARE cardsPlayedCount INT;
    DECLARE nextPlayerID INT;
    DECLARE checkerID INT;
    DECLARE checkResult VARCHAR(20);
    DECLARE userId INT;

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
    IF NOT EXISTS (SELECT 1 FROM CurrentTurn WHERE turn_player_id IN (SELECT id FROM Players WHERE lobby_id = lobbyId)) THEN
        SELECT 'Игра еще не начата' AS error;
        LEAVE updateGameInfo;
    END IF;

    -- Получение id текущего игрока и текущего номинала
    SELECT turn_player_id, current_rank INTO currentPlayerID, currentRank
    FROM CurrentTurn JOIN Players ON CurrentTurn.turn_player_id = Players.id
    WHERE Players.lobby_id = lobbyID;

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    -- Кол-во карт на столе
    SELECT COUNT(*) INTO cardsOnTableCount FROM TableCards WHERE lobby_id = lobbyID;

    -- Кол-во карт которыеми сходил текущий игрок
    SELECT COUNT(*) INTO cardsPlayedCount FROM TurnCards WHERE turn_player_id = currentPlayerID;

    -- Cлед игрок
    SET nextPlayerID = findNextPlayer(currentPlayerID, lobbyID);

    -- Кто делает проверку
    SELECT player_id INTO checkerID FROM Checks
    WHERE turn_player_id = currentPlayerID AND EXISTS (SELECT 1 FROM Players WHERE id = checkerID AND lobby_id = lobbyID) LIMIT 1;

    -- Проверка результата проверки, если она была
    IF checkerID IS NOT NULL THEN
        SET checkResult = 'Ожидается проверка';
    ELSE
        SET checkResult = 'Нет проверок';
    END IF;

    -- Вывод инфы
    SELECT currentPlayerID, currentRank,cardsOnTableCount, cardsPlayedCount, nextPlayerID, checkerID, checkResult;

END updateGameInfo;

-- Error: Result consisted of more than one row
CREATE PROCEDURE getPlayerCards(token INT UNSIGNED, lobbyId INT)
COMMENT 'Получить карты игрока. Параметры: userToken, lobbyId'
getPlayerCards: BEGIN

    DECLARE userId INT;
    -- Проверка на валидность токена
	DECLARE userLogin VARCHAR(64) DEFAULT getUserLoginByToken(token);
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
        LEAVE getPlayerCards;
    END IF;

    -- Получение userId из login
    SELECT id INTO userId FROM Users WHERE login = userLogin;

    SELECT `rank`
    FROM PlayerCards JOIN Cards ON PlayerCards.card_id = Cards.id
    WHERE player_id = (SELECT id FROM Players WHERE user_id = userId AND lobby_id = lobbyId);
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