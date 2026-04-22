module.exports = async function handler(req, res) {
  console.log('OPENAI_KEY EXISTS:', !!process.env.OPENAI_API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { audio, mimeType } = req.body;

  if (!audio) {
    return res.status(400).json({ error: 'audio is required' });
  }

  try {
    const buffer = Buffer.from(audio, 'base64');
    const ext = mimeType?.includes('mp4') ? 'mp4' : mimeType?.includes('ogg') ? 'ogg' : 'webm';

    const formData = new FormData();
    const blob = new Blob([buffer], { type: mimeType || 'audio/webm' });
    formData.append('file', blob, `audio.${ext}`);
    formData.append('model', 'whisper-1');
    formData.append('language', 'es');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Whisper error:', JSON.stringify(data));
      return res.status(400).json({ error: data });
    }

    return res.status(200).json({ text: data.text });
  } catch (err) {
    console.error('Transcribe error:', err);
    return res.status(500).json({ error: err.message, details: err.toString() });
  }
};
