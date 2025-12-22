import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

interface Comment {
  id: string;
  content: string;
  createdAt: Timestamp;
}

interface Praise {
  id: string;
  content: string;
  date: string;
  userId: string;
  createdAt: Timestamp;
  comments?: Comment[];
}

export const PraiseList = () => {
  const [praises, setPraises] = useState<Praise[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const q = query(
      collection(db, 'praises'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const praiseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Praise));
      setPraises(praiseData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddComment = async (praiseId: string) => {
    const commentContent = commentInputs[praiseId]?.trim();

    if (!commentContent) return;

    try {
      await addDoc(collection(db, 'praises', praiseId, 'comments'), {
        content: commentContent,
        createdAt: serverTimestamp(),
      });

      // 入力欄をクリア
      setCommentInputs(prev => ({
        ...prev,
        [praiseId]: ''
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const updateCommentInput = (praiseId: string, value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [praiseId]: value
    }));
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (praises.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#666'
      }}>
        まだ何も登録されていません。<br />
        今日頑張ったことを登録しましょう!
      </div>
    );
  }

  return (
    <div>
      <h2>頑張った記録</h2>
      {praises.map((praise) => (
        <PraiseItem
          key={praise.id}
          praise={praise}
          commentInput={commentInputs[praise.id] || ''}
          onCommentInputChange={(value) => updateCommentInput(praise.id, value)}
          onAddComment={() => handleAddComment(praise.id)}
        />
      ))}
    </div>
  );
};

interface PraiseItemProps {
  praise: Praise;
  commentInput: string;
  onCommentInputChange: (value: string) => void;
  onAddComment: () => void;
}

const PraiseItem = ({
  praise,
  commentInput,
  onCommentInputChange,
  onAddComment
}: PraiseItemProps) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'praises', praise.id, 'comments'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Comment));
      setComments(commentData);
    });

    return () => unsubscribe();
  }, [praise.id]);

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      marginBottom: '16px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <span style={{
          backgroundColor: '#e3f2fd',
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#1976d2'
        }}>
          {praise.date}
        </span>
      </div>

      <p style={{
        fontSize: '18px',
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        {praise.content}
      </p>

      {/* コメント表示 */}
      {comments.length > 0 && (
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '12px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
            コメント
          </h4>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                backgroundColor: 'white',
                padding: '8px 12px',
                marginBottom: '8px',
                borderRadius: '4px',
                borderLeft: '3px solid #4CAF50'
              }}
            >
              {comment.content}
            </div>
          ))}
        </div>
      )}

      {/* コメント入力 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={commentInput}
          onChange={(e) => onCommentInputChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onAddComment();
            }
          }}
          placeholder="コメントを追加..."
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
        <button
          onClick={onAddComment}
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            padding: '8px 16px',
            fontSize: '14px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          追加
        </button>
      </div>
    </div>
  );
};
