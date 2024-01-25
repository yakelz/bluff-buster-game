# Этап 1: Сборка клиентского приложения
FROM node:latest as build

# Установка рабочей директории для сборки клиента
WORKDIR /usr/src/app/client

# Копирование файлов клиента и установка зависимостей
COPY Client/package*.json ./
RUN npm install

# Копирование остальных файлов клиента и сборка
COPY Client/ ./
RUN npm run build

# Этап 2: Запуск сервера
FROM node:latest

# Установка рабочей директории для сервера
WORKDIR /usr/src/app

# Копирование файлов сервера и установка зависимостей
COPY Server/package*.json ./
RUN npm install

# Копирование остальных файлов сервера
COPY Server/ ./

# Копирование собранного клиентского приложения из предыдущего этапа
COPY --from=build /usr/src/app/client/build ./client/build

# Открытие портов (3000 для клиента и 5001 для сервера)
EXPOSE 3000 5001

# Команда для запуска сервера
CMD ["node", "index.js"]
