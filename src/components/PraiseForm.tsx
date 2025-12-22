import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

interface PraiseFormProps {
  onPraiseAdded: () => void;
}

export const PraiseForm = ({ onPraiseAdded }: PraiseFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setMessage('頑張ったことを入力してください');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await addDoc(collection(db, 'praises'), {
        content: content.trim(),
        date: date,
        userId: 'user-001', // 後で認証機能追加時にユーザーIDを使用
        createdAt: serverTimestamp(),
      });

      setContent('');
      setDate(new Date().toISOString().split('T')[0]);
      setMessage('登録しました!');
      onPraiseAdded();

      // 3秒後にメッセージを消す
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding praise:', error);
      setMessage('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '24px',
      borderRadius: '8px',
      marginBottom: '24px'
    }}>
      <h2 style={{ marginTop: 0 }}>今日も頑張った!</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            日付
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            何を頑張った?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="例: プロジェクトの締め切りに間に合わせた!"
            rows={4}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px 24px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '登録中...' : '登録する'}
        </button>

        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: message.includes('エラー') ? '#ffebee' : '#e8f5e9',
            borderRadius: '4px',
            color: message.includes('エラー') ? '#c62828' : '#2e7d32'
          }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};
