# AI Writing Assistant Setup Instructions

## Проблема
AI Writing Assistant показывает только мок-ответы вместо реальных ответов от ИИ.

## Решение

### 1. Создайте файл .env.local
Создайте файл `.env.local` в корне проекта со следующим содержимым:

```env
# Supabase Configuration (можно оставить как есть для demo режима)
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_key_placeholder

# OpenRouter API Key (ВАЖНО: замените на ваш реальный ключ)
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-ваш_реальный_ключ_здесь
```

### 2. Получите OpenRouter API ключ
1. Зайдите на https://openrouter.ai/
2. Зарегистрируйтесь или войдите в аккаунт
3. Перейдите в раздел API Keys
4. Создайте новый ключ
5. Скопируйте ключ (он начинается с `sk-or-v1-`)

### 3. Обновите .env.local
Замените `sk-or-v1-ваш_реальный_ключ_здесь` на ваш реальный ключ.

### 4. Перезапустите сервер
```bash
npm run dev
```

### 5. Проверьте работу
1. Откройте любую задачу (Tasks → выберите задачу)
2. Прокрутите до секции "AI Writing Assistant"
3. Вставьте текст и нажмите "Analyze with AI"
4. В консоли браузера (F12) должны появиться отладочные сообщения

## Отладка

### Проверка переменных окружения
Запустите:
```bash
npm run check-env
```

### Проверка в браузере
1. Откройте DevTools (F12)
2. Перейдите в Console
3. При использовании AI Writing Assistant должны появиться сообщения:
   - `🔍 AI Debug Info:`
   - `- API Key available: true`
   - `- API Key length: [число больше 20]`

### Если видите "Using mock AI response"
Это означает, что API ключ не настроен правильно. Проверьте:
1. Файл .env.local существует
2. Переменная называется `NEXT_PUBLIC_OPENROUTER_API_KEY`
3. Ключ начинается с `sk-or-v1-`
4. Сервер перезапущен после изменения .env.local

## Исправленные файлы
- `src/lib/ai.ts` - улучшена отладка и проверка API ключа
- `src/components/AIAnalysis.tsx` - подключен к реальному API
- `env.local.example` - исправлено название переменной
- `scripts/check-env.js` - обновлена проверка переменных
