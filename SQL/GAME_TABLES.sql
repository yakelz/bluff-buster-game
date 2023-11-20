-- Таблица информации о картах
CREATE TABLE Cards (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'id карты',
  rank ENUM ('A','2','3','4','5','6','7','8','9','10','J','Q','K') NOT NULL COMMENT 'Ранг карты'
) COMMENT='Таблица информации о картах';

-- Таблица для хранения карт на столе
CREATE TABLE TableCards (
  card_id INT PRIMARY KEY NOT NULL COMMENT 'id карты',
  lobby_id INT NOT NULL COMMENT 'id лобби',
  FOREIGN KEY (card_id) REFERENCES Cards (id) ON DELETE RESTRICT,
  FOREIGN KEY (lobby_id) REFERENCES GameLobbies (id) ON DELETE CASCADE
) COMMENT='Таблица для хранения карт на столе';

-- Таблица для хранения карт игроков
CREATE TABLE PlayerCards (
  card_id INT PRIMARY KEY NOT NULL COMMENT 'id карты',
  player_id INT NOT NULL COMMENT 'id игрока',
  FOREIGN KEY (card_id) REFERENCES Cards (id) ON DELETE RESTRICT,
  FOREIGN KEY (player_id) REFERENCES Players(id) ON DELETE CASCADE
) COMMENT='Таблица для хранения карт игроков';

-- Таблица для хранения информации о текущем ходе
CREATE TABLE CurrentTurn (
  turn_player_id INT NOT NULL COMMENT 'id игрока, делающего ход',
  current_rank ENUM ('A','2','3','4','5','6','7','8','9','10','J','Q','K') NOT NULL COMMENT 'Текущий ранг карты',
  start_time DATETIME NOT NULL COMMENT 'Время начала хода',
  FOREIGN KEY (turn_player_id) REFERENCES Players(id) ON DELETE CASCADE
) COMMENT='Таблица для хранения информации о текущем ходе';

-- Таблица для хранения карт текущего хода
CREATE TABLE TurnCards (
  card_id INT PRIMARY KEY  NOT NULL COMMENT 'id карты',
  turn_player_id INT NOT NULL COMMENT 'id игрока, делающего ход',
  FOREIGN KEY (card_id) REFERENCES Cards (id) ON DELETE RESTRICT,
  FOREIGN KEY (turn_player_id) REFERENCES CurrentTurn (turn_player_id) ON DELETE CASCADE
) COMMENT='Таблица для хранения карт текущего хода';

-- Таблица для хранения проверок игроков
CREATE TABLE Checks (
  player_id INT PRIMARY KEY NOT NULL COMMENT 'id игрока',
  turn_player_id INT NOT NULL COMMENT 'id игрока, делающего ход',
  start_time DATETIME NOT NULL COMMENT 'Время начала проверки',
  FOREIGN KEY (player_id) REFERENCES Players(id) ON DELETE CASCADE,
  FOREIGN KEY (turn_player_id ) REFERENCES CurrentTurn (turn_player_id ) ON DELETE CASCADE,
  UNIQUE ak(turn_player_id )
) COMMENT='Таблица для хранения проверок игроков';




