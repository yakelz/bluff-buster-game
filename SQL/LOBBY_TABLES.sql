-- Таблица игровых лобби
CREATE TABLE GameLobbies
(
    id         INT AUTO_INCREMENT PRIMARY KEY COMMENT 'id игрового лобби',
    password   VARCHAR(10) COMMENT 'Пароль для лобби',
    turn_time  INT UNSIGNED                                                                                            NOT NULL DEFAULT 30 COMMENT 'Время хода в секундах',
    check_time INT UNSIGNED                                                                                            NOT NULL DEFAULT 15 COMMENT 'Время для проверки хода в секундах',
    host_id    INT COMMENT 'id хоста',
    state      ENUM ('Start', 'Turn', 'Check Accepting', 'Checking') NOT NULL,
    FOREIGN KEY (host_id) REFERENCES Users (id) ON DELETE SET NULL
) COMMENT ='Таблица игровых лобби';

CREATE TABLE PlayerConfirmations
(
    player_id INT PRIMARY KEY NOT NULL COMMENT 'id игрока',
    FOREIGN KEY (player_id) REFERENCES Players (id) ON DELETE CASCADE
) COMMENT ='Таблица потвердждение игрока';

-- Таблица информации о игроках
CREATE TABLE Players
(
    id           INT PRIMARY KEY AUTO_INCREMENT COMMENT 'id игрока',
    user_id      INT              NOT NULL COMMENT 'id пользователя, к которому привязан игрок',
    lobby_id     INT              NOT NULL COMMENT 'id лобби',
    checks_count TINYINT UNSIGNED NOT NULL DEFAULT 3 COMMENT 'Количество проверок игрока',
    auto_play    BOOLEAN          NOT NULL DEFAULT 0 COMMENT 'Автоматическая игра',
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
    FOREIGN KEY (lobby_id) REFERENCES GameLobbies (id) ON DELETE CASCADE,
    UNIQUE ak (user_id, lobby_id)
) COMMENT ='Таблица информации о игроках';

-- Таблица для хранения связи между пользователями и лобби
CREATE TABLE UsersInLobby
(
    user_id  INT     NOT NULL COMMENT 'id пользователя',
    lobby_id INT     NOT NULL COMMENT 'id лобби',
    is_ready BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Готовность игрока к началу игры',
    PRIMARY KEY (user_id, lobby_id),
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
    FOREIGN KEY (lobby_id) REFERENCES GameLobbies (id) ON DELETE CASCADE
) COMMENT ='Таблица для хранения связи между пользователями и лобби';
