export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API Key 未設定' });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://book-insight.vercel.app',
        'X-Title': '書摘思考站'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4-5',
        messages: req.body.messages,
        max_tokens: 4000
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || '請求失敗');

    const text = data.choices?.[0]?.message?.content || '';
    res.json({ content: [{ type: 'text', text }] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
