# Умник AI — Vercel + OpenRouter версия

## Что нужно добавить в Vercel

Settings → Environment Variables:

```env
OPENROUTER_API_KEY=твой_ключ_OpenRouter
OPENROUTER_MODEL=google/gemini-3.1-flash-lite
```

После добавления переменных нужно сделать новый Deploy / Redeploy.

## Файлы

- `index.html` — интерфейс приложения.
- `api/chat.js` — серверная функция Vercel, которая отправляет запрос в OpenRouter.
- `assets/` — картинки и логотип.


## Voice Call Mode

В этой версии добавлен режим «Созвон с Умником».

Условия показа кнопки:
- тариф: Умник Плюс;
- режим ответа: AI;
- экран чата.

Для работы AI в Vercel должны быть переменные:
- OPENROUTER_API_KEY
- OPENROUTER_MODEL, например google/gemini-3.1-flash-lite

Голосовой режим лучше всего работает в Google Chrome.
