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
