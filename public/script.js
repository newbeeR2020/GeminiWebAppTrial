// public/script.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('apiForm');
  const userInput = document.getElementById('userInput');
  const output = document.getElementById('output');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // フォームのデフォルト送信を防ぐ

    const inputText = userInput.value.trim();
    if (!inputText) {
      alert('入力が空です。何か入力してください。');
      return;
    }

    // リクエストペイロードの作成
    const payload = {
      contents: [
        {
          parts: [
            {
              text: inputText
            }
          ]
        }
      ]
    };

    try {
      // サーバーサイドAPIへのPOSTリクエスト
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '未知のエラーが発生しました。');
      }

      const data = await response.json();

      // 結果の表示
      if (data.candidates && data.candidates.length > 0) {
        const content = data.candidates[0].content.parts[0].text;
        output.textContent = content;
      } else {
        output.textContent = '結果がありませんでした。';
      }
    } catch (error) {
      console.error('Error:', error);
      output.textContent = `エラー: ${error.message}`;
    }
  });
});
