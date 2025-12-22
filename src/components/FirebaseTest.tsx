import { useState } from 'react';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const FirebaseTest = () => {
  const [message, setMessage] = useState('');
  const [praises, setPraises] = useState<any[]>([]);

  // データベースにテストデータを追加
  const addTestPraise = async () => {
    try {
      const docRef = await addDoc(collection(db, 'praises'), {
        content: '今日も頑張った!',
        userId: 'test-user',
        createdAt: serverTimestamp(),
      });
      setMessage(`成功! ドキュメントID: ${docRef.id}`);
    } catch (error) {
      setMessage(`エラー: ${error}`);
    }
  };

  // データベースからデータを取得
  const fetchPraises = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'praises'));
      const fetchedPraises = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPraises(fetchedPraises);
      setMessage(`${fetchedPraises.length}件のデータを取得しました`);
    } catch (error) {
      setMessage(`エラー: ${error}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Firebase 動作確認</h2>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={addTestPraise} style={{ marginRight: '10px', padding: '10px' }}>
          テストデータを追加
        </button>
        <button onClick={fetchPraises} style={{ padding: '10px' }}>
          データを取得
        </button>
      </div>

      {message && (
        <div style={{
          padding: '10px',
          backgroundColor: message.includes('エラー') ? '#ffebee' : '#e8f5e9',
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      {praises.length > 0 && (
        <div>
          <h3>取得したデータ:</h3>
          <ul>
            {praises.map((praise) => (
              <li key={praise.id}>
                {praise.content} (ID: {praise.id})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
