# OpenRouter API Setup Guide

## 🔧 Настройка OpenRouter API

### 1. Получение API ключа

1. Перейдите на [OpenRouter.ai](https://openrouter.ai/)
2. Зарегистрируйтесь или войдите в аккаунт
3. Перейдите в раздел "Keys" в вашем профиле
4. Создайте новый API ключ
5. Скопируйте ключ (он выглядит как `sk-or-v1-...`)

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenRouter API Configuration
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

### 3. Проверка работы

1. Запустите приложение: `npm run dev`
2. Откройте AI Chat страницу
3. Откройте Developer Tools (F12)
4. Перейдите на вкладку Console
5. Отправьте сообщение в чат
6. Проверьте логи в консоли:

```
🔍 AI Debug Info:
- API Key available: true
- API Key length: 45
- Messages count: 2
- Last message: Hello
🚀 Sending request to OpenRouter API...
📡 Response status: 200
✅ AI Response received: {...}
```

### 4. Возможные проблемы

#### Проблема: "API Key not configured"
**Решение:** Убедитесь, что файл `.env.local` создан и содержит правильный API ключ

#### Проблема: "401 Unauthorized"
**Решение:** Проверьте правильность API ключа и убедитесь, что у вас есть кредиты на OpenRouter

#### Проблема: "429 Too Many Requests"
**Решение:** Превышен лимит запросов. Подождите или обновите план подписки

#### Проблема: "Network Error"
**Решение:** Проверьте интернет-соединение и настройки прокси

### 5. Тестирование без API ключа

Если у вас нет API ключа, приложение будет использовать mock ответы, которые:
- Работают офлайн
- Предоставляют релевантные ответы на основе ключевых слов
- Демонстрируют функциональность AI чата

### 6. Модели AI

По умолчанию используется `meta-llama/llama-3.1-8b-instruct:free` - бесплатная модель.

Доступные модели:
- `meta-llama/llama-3.1-8b-instruct:free` (бесплатная)
- `meta-llama/llama-3.1-70b-instruct` (платная, более мощная)
- `openai/gpt-3.5-turbo` (платная)
- `anthropic/claude-3-haiku` (платная)

Для смены модели измените параметр `model` в файле `src/lib/ai.ts`
