const SYSTEM_PROMPT = `
Ты — Умник AI, безопасный детский учебный помощник для школьников 1–4 классов.
Ты работаешь как добрый AI-репетитор: объясняешь школьные темы простым языком и по шагам.

Правила:
1. Объясняй коротко, понятно и доброжелательно.
2. Не просто давай ответ, а показывай, как думать.
3. Если ребёнок просит решить задание, сначала объясни ход решения.
4. Если вопрос неучебный, опасный, грубый, интимный или вредный — мягко откажись и предложи учебную тему.
5. Если вопрос непонятный — попроси уточнить.
6. Если ребёнок устал или переживает — поддержи.
7. Основные предметы: математика и русский язык 1–4 классов. Можно кратко отвечать по окружающему миру, истории и географии.
8. Если есть фото задания — прочитай его и объясни решение текстом.
9. Если в запросе есть история разговора, учитывай её: продолжай тему, помни предыдущие вопросы и не начинай каждый ответ с нуля.
10. Если есть профиль ученика и память, адаптируй ответ под класс, сложные темы, стиль объяснения и последние ошибки ребёнка.
11. Используй память мягко: не говори каждый раз «я помню», но продолжай тему так, будто это настоящий репетитор.

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
  return { emotion: 'explain', text: 'Я в демо-режиме. Для настоящего AI-ответа добавь OPENROUTER_API_KEY в переменные окружения Vercel.' };
}

function safeJsonParse(text) {
  const raw = String(text || '').trim();

  try {
    return JSON.parse(raw);
  } catch {}

  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }

  return null;
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-12)
    .map((m) => {
      const role = m && m.role === 'assistant' ? 'assistant' : 'user';
      const content = String(m && (m.content || m.text) || '').slice(0, 1800);
      if (!content.trim()) return null;
      return { role, content };
    })
    .filter(Boolean);
}

async function callOpenRouter({ message, age, chatTitle, imageDataUrl, history, profile, memory }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || process.env.MODEL || 'google/gemini-3.1-flash-lite';

  if (!apiKey || apiKey.includes('PASTE') || apiKey.length < 20) {
    return { ...demoAnswer(message), source: 'demo' };
  }

  const cleanHistory = normalizeHistory(history);

  const userContent = [
    {
      type: 'text',
      text: `Возраст ребёнка: ${age || 'не указан'}\nЧат: ${chatTitle || 'Домашка'}\n\nПрофиль ученика:\n${JSON.stringify(profile || {}, null, 2)}\n\nПамять Умника об ученике:\n${JSON.stringify(memory || {}, null, 2)}\n\nТекущий вопрос: ${message || 'Пользователь прикрепил фото задания.'}`
    }
  ];

  if (imageDataUrl && String(imageDataUrl).startsWith('data:image/')) {
    userContent.push({
      type: 'image_url',
      image_url: { url: imageDataUrl }
    });
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...cleanHistory,
    { role: 'user', content: userContent }
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://umnik-ai.vercel.app',
      'X-Title': 'Umnik AI'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.35,
      max_tokens: 900
    })
  });

  const raw = await response.text();

  if (!response.ok) {
    console.error('OpenRouter error', response.status, raw);
    return {
      emotion: 'confused',
      source: 'error',
      text: 'AI сейчас не ответил. Проверь OPENROUTER_API_KEY, баланс OpenRouter и название модели в Vercel.'
    };
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return {
      emotion: 'confused',
      source: 'error',
      text: 'OpenRouter вернул непонятный ответ. Попробуй ещё раз.'
    };
  }

  const out = String(data?.choices?.[0]?.message?.content || '').trim();
  const parsed = safeJsonParse(out);

  if (parsed) {
    return {
      emotion: parsed.emotion || 'explain',
      text: parsed.text || 'Я готов помочь, но ответ получился пустым. Попробуй спросить ещё раз.',
      source: 'ai'
    };
  }

  return {
    emotion: 'explain',
    text: out || 'Я готов помочь. Напиши вопрос ещё раз чуть конкретнее.',
    source: 'ai'
  };
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
    const answer = body.mode === 'demo'
      ? { ...demoAnswer(body.message), source: 'demo' }
      : await callOpenRouter(body);

    res.statusCode = 200;
    res.end(JSON.stringify(answer));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({
      emotion: 'confused',
      text: 'Ошибка сервера. Проверь логи Vercel Function.',
      error: String(err.message || err)
    }));
  }
};
