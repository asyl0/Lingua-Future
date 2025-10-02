# 🚀 Lingua Future - Быстрый запуск

## Текущее состояние: DEMO MODE

Проект сейчас работает в демо-режиме. Вы можете использовать тестовые учетные данные для входа:

### 🎯 Тестовые учетные данные

- **Студент:** `student@test.com` / `password`
- **Учитель:** `teacher@test.com` / `password`

## 🔧 Для полной функциональности

Чтобы включить полную функциональность Supabase:

### 1. Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
```

### 2. Получите учетные данные Supabase:

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Перейдите в Settings → API
4. Скопируйте:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Настройте базу данных:

1. В Supabase SQL Editor выполните содержимое файла `SUPABASE_SCHEMA.sql`
2. Это создаст все необходимые таблицы и политики

### 4. Перезапустите сервер разработки:

```bash
npm run dev
```

## ✅ Исправленные проблемы

- ❌ Ошибки "Invalid API key" 
- ❌ Ошибки "Auth session missing"
- ❌ 401 Unauthorized ошибки
- ❌ Предупреждения о переменных окружения
- ✅ Добавлен демо-режим для тестирования
- ✅ Улучшена обработка ошибок
- ✅ Добавлены понятные сообщения для пользователей

## 🎮 Использование

1. Откройте [http://localhost:3000](http://localhost:3000)
2. Нажмите "Sign in"
3. Используйте тестовые учетные данные
4. Исследуйте функционал приложения

## 📞 Поддержка

Если у вас остались вопросы, проверьте файлы:
- `TROUBLESHOOTING.md` - подробное руководство по устранению неполадок
- `SETUP.md` - полное руководство по настройке
