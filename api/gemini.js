// api/gemini.js

const axios = require('axios');

module.exports = async (req, res) => {
  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    console.log(`Invalid request method: ${req.method}`);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 入力検証
  const { contents } = req.body;
  if (!contents || !Array.isArray(contents)) {
    console.log('Invalid request body:', req.body);
    return res.status(400).json({ error: 'Invalid input data' });
  }

  // 環境変数からAPIキーを取得
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  console.log('GEMINI_API_KEY is set:', !!GEMINI_API_KEY); // デバッグログ

  if (!GEMINI_API_KEY) {
    console.log('API key is missing');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // 外部API呼び出し
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      { contents },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // 成功時にクライアントへレスポンスを返す
    return res.status(200).json(response.data);
  } catch (error) {
    // 外部APIエラーのハンドリング
    console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Failed to fetch data from Gemini API' });
  }
};
