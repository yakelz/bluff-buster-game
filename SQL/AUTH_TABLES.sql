-- Таблица пользователей
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'id пользователя',
  login VARCHAR(64) NOT NULL COMMENT 'Логин пользователя',
  password VARCHAR(64) NOT NULL COMMENT 'Пароль пользователя',
  win_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Кол-во выигранных игр пользователя',
  UNIQUE ak(login)
) COMMENT='Таблица пользователей';

-- Таблица токенов пользователей
CREATE TABLE Tokens (
  login VARCHAR(64) NOT NULL COMMENT 'Логин пользователя',
  FOREIGN KEY login(login) REFERENCES Users(login),
  token INT UNSIGNED PRIMARY KEY COMMENT 'Токен пользователя',
  created DATETIME NOT NULL DEFAULT NOW() COMMENT 'Дата создания токена'
) COMMENT='Таблица токенов пользователей';

