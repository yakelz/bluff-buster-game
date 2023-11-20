-- Регистрация пользователя
CREATE PROCEDURE register (login VARCHAR(64), password VARCHAR(64))
COMMENT "Регистрация пользователя. Параметры: login, password"
BEGIN
    -- Проверка на минимальную длину пароля и наличие как минимум одной буквы и одной цифры
    IF LENGTH(password) < 6 OR password NOT REGEXP '[0-9]' OR password NOT REGEXP '[a-zA-Z]' THEN
        SELECT 'Пароль должен быть длиной не менее 6 символов и содержать как минимум одну букву и одну цифру' AS error;
    ELSE
        INSERT IGNORE INTO Users(login, password) VALUES(login, hashPassword(password));
        IF ROW_COUNT() = 0 THEN
            SELECT 'Такой логин уже занят' AS error;
        ELSE
            CALL login(login, password);
        END IF;
    END IF;
END;

-- Функция хэширования пароля
CREATE FUNCTION hashPassword(password VARCHAR(50))
RETURNS VARCHAR(64)
COMMENT "Хэширование пароля. Параметры: password. Возвращает: 16-ричный хэш длиной 64 символа"
RETURN SHA2(CONCAT(password, 'megasalt'), 256);

-- Авторизация пользователя
CREATE PROCEDURE login (lg VARCHAR(50), pw VARCHAR(50))
COMMENT "Авторизация пользователя. Параметры: login, password"
BEGIN
	DECLARE tk INT UNSIGNED DEFAULT CEIL(RAND() * 4000000000);
	IF hashPassword(pw) = (SELECT password FROM Users WHERE login = lg)
		THEN
            CALL clearTokens();
			INSERT INTO Tokens (token, login) VALUES (tk, lg);
			SELECT tk AS token;
			CALL showUserInfo(tk);
		ELSE SELECT 'Пароль или логин неверный' AS error;
	END IF;
END;

-- Выход из аккаунта
CREATE PROCEDURE logout(tk INT UNSIGNED)
COMMENT "Выход из аккаунта. Параметры: token"
BEGIN
    DECLARE userLogin VARCHAR(64);
    SELECT login INTO userLogin FROM Tokens WHERE token = tk;
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
    ELSE
        DELETE FROM Tokens WHERE token = tk;
        SELECT 'Вы успешно вышли из аккаунта' AS message;
    END IF;
END;


-- Процедура вывода информации о пользователе
CREATE PROCEDURE showUserInfo(tk INT UNSIGNED)
COMMENT "Вывод информации о пользователе. Параметры: token"
BEGIN
    -- Проверка на валидность токена
	DECLARE userLogin VARCHAR(64);
	SELECT login INTO userLogin FROM Tokens WHERE token = tk;
    IF userLogin IS NULL THEN
        SELECT 'Невалидный токен' AS error;
    ELSE
        -- Запрос
        SELECT login, win_count FROM Users WHERE login = userLogin;
    END IF;
END;

-- Процедура очистки старых токенов
CREATE PROCEDURE clearTokens()
COMMENT "Очистка старых токенов"
BEGIN
	-- Удаление старых токенов. Если токену больше чем день
	DELETE FROM Tokens WHERE TIMESTAMPDIFF(DAY, created, NOW()) > 1;
END;