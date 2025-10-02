# 🔐 Настройка реальной аутентификации Supabase

## 📋 Шаг 1: Создание проекта Supabase

### 1.1 Регистрация и создание проекта
1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project"
3. Войдите через GitHub или создайте аккаунт
4. Нажмите "New Project"
5. Выберите организацию
6. Заполните данные проекта:
   - **Name**: `lingua-future` (или любое имя)
   - **Database Password**: создайте надежный пароль
   - **Region**: выберите ближайший регион
7. Нажмите "Create new project"

### 1.2 Получение учетных данных
1. Дождитесь создания проекта (1-2 минуты)
2. Перейдите в **Settings** → **API**
3. Скопируйте:
   - **Project URL** (например: `https://abcdefgh.supabase.co`)
   - **anon public** ключ (начинается с `eyJhbGciOiJIUzI1NiIs...`)

## 📋 Шаг 2: Настройка переменных окружения

### 2.1 Создание .env.local
Создайте файл `.env.local` в корне проекта:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# OpenRouter API Key (для AI функций)
OPENROUTER_API_KEY=your_openrouter_key_here
```

### 2.2 Замените значения
- Замените `https://your-project-id.supabase.co` на ваш Project URL
- Замените `your_anon_key_here` на ваш anon public ключ

## 📋 Шаг 3: Настройка базы данных

### 3.1 Создание таблиц
1. В Supabase перейдите в **SQL Editor**
2. Скопируйте и выполните содержимое файла `SUPABASE_SCHEMA.sql`

### 3.2 Настройка аутентификации
1. Перейдите в **Authentication** → **Settings**
2. В разделе **Site URL** добавьте: `http://localhost:3000`
3. В разделе **Redirect URLs** добавьте: `http://localhost:3000/**`
4. Отключите **Enable email confirmations** для разработки
5. Сохраните изменения

## 📋 Шаг 4: Тестирование

### 4.1 Перезапуск сервера
```bash
npm run dev
```

### 4.2 Проверка подключения
```bash
npm run check-supabase
```

### 4.3 Регистрация пользователя
1. Перейдите на `/auth/register`
2. Заполните форму регистрации
3. Выберите роль (Student/Teacher)
4. Нажмите "Register"

### 4.4 Вход в систему
1. Перейдите на `/auth/login`
2. Введите email и пароль
3. Нажмите "Sign in"

## 🔧 Возможные проблемы

### Ошибка "Invalid API key"
- Проверьте правильность Project URL и anon key
- Убедитесь, что нет лишних пробелов в .env.local
- Перезапустите сервер разработки

### Ошибка "Email not confirmed"
- Отключите email confirmations в настройках Supabase
- Или проверьте почту и подтвердите email

### Ошибка "Profile not found"
- Убедитесь, что выполнили SQL скрипт для создания таблиц
- Проверьте RLS политики в Supabase

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте консоль браузера на ошибки
2. Проверьте логи Supabase в Dashboard
3. Убедитесь, что все переменные окружения настроены правильно
