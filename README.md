# Another Knowledge Base API

> API для хранения и управления статьями базы знаний.  
> Поддерживает регистрацию, аутентификацию, CRUD-операции со статьями и разграничение доступа.

---

## 📦 1. Установка и запуск

### 🔧 Установка зависимостей
1. Клонируем репозиторий:
   ```bash
   git clone https://github.com/your-repo/another-knowledge-base.git
   cd another-knowledge-base
   ```
2. Устанавливаем зависимости:
   ```bash
   npm install
   ```
3. Создаём файл `.env` и добавляем переменные:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/knowledge_base
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```
4. Запускаем сервер в режиме разработки:
   ```bash
   npm run dev
   ```

### 📡 Запуск в продакшене
1. Собираем TypeScript:
   ```bash
   npm run build
   ```
2. Запускаем:
   ```bash
   npm start
   ```

---

## 📖 2. Документация API
Swagger-документация доступна по адресу:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---

## 🔗 3. Основные эндпоинты

### 🛡 Аутентификация
| Метод | URL           | Описание |
|--------|-------------|----------|
| `POST`   | `/auth/register` | Регистрация |
| `POST`   | `/auth/login` | Вход |

### 📄 Статьи
| Метод | URL             | Описание |
|--------|---------------|----------|
| `POST`   | `/articles`     | Создать статью (только авторизованные) |
| `GET`    | `/articles`     | Получить все статьи (только публичные) |
| `GET`    | `/articles/:id` | Получить статью по ID |
| `PUT`    | `/articles/:id` | Обновить статью (только автор) |
| `DELETE` | `/articles/:id` | Удалить статью (только автор) |

### 🔍 Фильтрация по тегам
Запрос:
```
GET /articles?tags=nodejs,express
```
Вернёт статьи с тегами `nodejs` или `express`.

---

## ✅ 4. Запуск тестов
Прогнать тесты можно командой:
```bash
npm run test
```
Тесты покрывают:
- Регистрацию и логин
- CRUD-операции для статей
- Контроль доступа к приватным статьям
- Валидацию данных

---

## ⚙ 5. Файл `.env` (Переменные окружения)
Создайте `.env` файл в корне проекта:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/knowledge_base
JWT_SECRET=your_secret_key
NODE_ENV=development
```
> ** В продакшене лучше использовать **безопасные переменные среды**.

---

## 🔧 6. Дополнительные файлы

### `.gitignore` (для исключения файлов из Git)
```
node_modules
dist
.env
.DS_Store
```