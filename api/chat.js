const SYSTEM_PROMPT = `
Ты — Умник AI, безопасный детский учебный помощник для школьников 1–4 классов.
Твоя задача — объяснять школьные темы простым, добрым и понятным языком.

Правила:
1. Объясняй коротко, по шагам, без сложных терминов.
2. Не просто давай ответ, а показывай, как думать.
3. Если ребёнок просит решить задание, сначала объясни ход решения.
4. Если вопрос неучебный, опасный, грубый, интимный или вредный — откажись мягко и предложи учебную тему.
5. Если вопрос непонятный — попроси уточнить.
6. Если ребёнок устал или переживает — поддержи.
7. Основные предметы: математика и русский язык 1–4 классов. Можно отвечать кратко по окружающему миру, истории, географии для демонстрации.
8. Если есть фото задания — прочитай его и объясни решение текстом.

Верни строго JSON без markdown:
{
  "emotion": "welcome|thinking|idea|explain|happy|support|confused|safe_stop",
  "text": "твой ответ"
}
`;

function demoAnswer(message = '') {
  const q = String(message).toLowerCase();
  if (q.includes('сказуем')) return { emotion: 'explain', text: 'Сказуемое — это главный член предложения, который показывает, что делает предмет. Например: «Лиса читает». Что делает? Читает — это сказуемое.' };
  if (q.includes('периметр')) return { emotion: 'explain', text: 'Периметр — это сумма длин всех сторон фигуры. Чтобы найти периметр, нужно сложить все стороны. У прямоугольника можно так: P = 2 × (длина + ширина).' };
  if (q.includes('дроб')) return { emotion: 'happy', text: 'Дробь показывает часть целого. Например, если пиццу разделили на 4 равные части и взяли 1 кусочек, это 1/4. Нижнее число показывает, на сколько частей разделили, верхнее — сколько взяли.' };
  if (q.includes('умнож') || q.includes('таблиц')) return { emotion: 'idea', text: 'Таблицу умножения лучше учить маленькими частями. Например, сегодня только ×2 и ×3, завтра повторение и ×4. Так мозгу легче запомнить.' };
  if (q.includes('устал') || q.includes('не получится')) return { emotion: 'support', text: 'Понимаю. Давай сделаем один маленький шаг. Напиши только первое задание, и я помогу разобрать его спокойно.' };
  return { emotion: 'explain', text: 'Я в демо-режиме. Для настоящего AI-ответа добавь OPENAI_API_KEY в переменные окружения Vercel.' };
}

async function callOpenAI({ message, age, chatTitle, imageDataUrl }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  if (!apiKey || apiKey.includes('PASTE') || apiKey.length < 20) {
    return { ...demoAnswer(message), source: 'demo' };
  }

  const content = [
    {
      type: 'input_text',
      text: `Возраст ребёнка: ${age || 'не указан'}\nЧат: ${chatTitle || 'Домашка'}\nВопрос: ${message || 'Пользователь прикрепил фото задания.'}`
    }
  ];

  if (imageDataUrl && String(imageDataUrl).startsWith('data:image/')) {
    content.push({ type: 'input_image', image_url: imageDataUrl });
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      instructions: SYSTEM_PROMPT,
      input: [{ role: 'user', content }],
      temperature: 0.35,
      max_output_tokens: 900
    })
  });

  const raw = await response.text();
  if (!response.ok) {
    console.error('OpenAI error', response.status, raw);
    return {
      emotion: 'confused',
      source: 'error',
      text: 'AI сейчас не ответил. Проверь переменную OPENAI_API_KEY в Vercel, баланс OpenAI Platform и название модели.'
    };
  }

  let data;
  try { data = JSON.parse(raw); } catch { data = {}; }

  let out = data.output_text || '';
  if (!out && Array.isArray(data.output)) {
    for (const item of data.output) {
      if (Array.isArray(item.content)) {
        for (const c of item.content) {
          if (typeof c.text === 'string') out += c.text;
        }
      }
    }
  }
  out = String(out || '').trim();

  try {
    const parsed = JSON.parse(out);
    return {
      emotion: parsed.emotion || 'explain',
      text: parsed.text || 'Я готов помочь, но ответ получился пустым. Попробуй спросить ещё раз.',
      source: 'ai'
    };
  } catch {
    return { emotion: 'explain', text: out || 'Я готов помочь. Напиши вопрос ещё раз чуть конкретнее.', source: 'ai' };
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  try {
    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const answer = body.mode === 'demo' ? { ...demoAnswer(body.message), source: 'demo' } : await callOpenAI(body);
    res.statusCode = 200;
    res.end(JSON.stringify(answer));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ emotion: 'confused', text: 'Ошибка сервера. Проверь логи Vercel Function.', error: String(err.message || err) }));
  }
};
