module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  console.log('Deepgram key prefix:', process.env.DEEPGRAM_API_KEY?.substring(0, 8));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    deepgramKey: process.env.DEEPGRAM_API_KEY,
    anthropicKey: process.env.ANTHROPIC_API_KEY,
  });
};
