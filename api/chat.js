module.exports = async function handler(req, res) {
  console.log('KEY EXISTS:', !!process.env.ANTHROPIC_API_KEY);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    console.log('Body que se manda a Anthropic:', JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 80,
      system: system?.substring(0, 50),
      messages: messages
    }));

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 80,
        ...(system && { system }),
        messages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      console.error('Anthropic error body:', JSON.stringify(data));
      return res.status(400).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Error completo:', err);
    return res.status(500).json({ error: err.message, details: err.toString() });
  }
}
