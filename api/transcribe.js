module.exports = async function handler(req, res) {
  console.log('DEEPGRAM_KEY EXISTS:', !!process.env.DEEPGRAM_API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { audio, mimeType } = req.body;

  if (!audio) {
    return res.status(400).json({ error: 'audio is required' });
  }

  try {
    const buffer = Buffer.from(audio, 'base64');

    const response = await fetch('https://api.deepgram.com/v1/listen?language=es&model=nova-2', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': mimeType || 'audio/webm',
      },
      body: buffer,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Deepgram error:', JSON.stringify(data));
      return res.status(400).json({ error: data });
    }

    const text = data.results?.channels[0]?.alternatives[0]?.transcript || '';
    return res.status(200).json({ text });
  } catch (err) {
    console.error('Transcribe error:', err);
    return res.status(500).json({ error: err.message, details: err.toString() });
  }
};
