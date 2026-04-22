module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(200).json({
    deepgramKey: process.env.DEEPGRAM_API_KEY,
    anthropicKey: process.env.ANTHROPIC_API_KEY,
  });
};
