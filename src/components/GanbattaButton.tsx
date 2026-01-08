import { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const PRAISE_MESSAGES = [
  { text: "最高！", icon: "star" },
  { text: "すごいじゃん！", icon: "celebration" },
  { text: "やったね！", icon: "emoji_events" },
  { text: "かっこいい！", icon: "whatshot" },
  { text: "えらい！", icon: "favorite" },
  { text: "がんばってるね！", icon: "fitness_center" },
  { text: "いい調子！", icon: "local_fire_department" },
  { text: "その調子！", icon: "bolt" },
  { text: "ナイス！", icon: "thumb_up" },
  { text: "完璧！", icon: "verified" },
  { text: "輝いてる！", icon: "auto_awesome" },
  { text: "やるじゃん！", icon: "stars" },
  { text: "素晴らしい！", icon: "grade" },
  { text: "サイコー！", icon: "rocket_launch" },
  { text: "イケてる！", icon: "sentiment_very_satisfied" },
  { text: "頑張り屋さん！", icon: "favorite_border" },
  { text: "すてき！", icon: "spa" },
  { text: "天才！", icon: "psychology" },
  { text: "グッジョブ！", icon: "done_all" },
  { text: "推せる！", icon: "music_note" },
];

export const GanbattaButton = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<{ text: string; icon: string; key: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimerRef = useRef<number | null>(null);

  // カウントを取得
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const q = query(collection(db, "clicks"), where("date", "==", today));
        const snapshot = await getDocs(q);
        setCount(snapshot.size);
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };

    fetchCount();
  }, []);

  const handleClick = () => {
    // 前のアニメーションタイマーをキャンセル
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }

    // UIをすぐに更新（オプティミスティック更新）
    setCount((prev) => prev + 1);
    setIsAnimating(true);

    // ランダムなメッセージを選択（一意のkeyで毎回アニメーションをリセット）
    const randomMessage = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
    setMessage({ ...randomMessage, key: Date.now() });

    // Firestoreに非同期で記録（UIをブロックしない）
    addDoc(collection(db, "clicks"), {
      date: new Date().toISOString().split("T")[0],
      timestamp: serverTimestamp(),
    }).catch((error) => {
      console.error("Error adding click:", error);
      // エラー時はカウントを戻す
      setCount((prev) => prev - 1);
    });

    // ボタンアニメーション終了
    animationTimerRef.current = window.setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="ganbatta-container">
      {/* ヘッダー：アプリ名とロゴ */}
      <div className="header">
        <h1 className="app-title">今日えらっ</h1>
        <span className="material-icons app-icon">redeem</span>
      </div>

      {/* 褒めメッセージ（上部に固定高さで配置） */}
      <div className="praise-area">
        {message && (
          <div key={message.key} className="praise-message">
            <span className="material-icons praise-icon">{message.icon}</span>
            {message.text}
          </div>
        )}
      </div>

      {/* カウント表示 */}
      <div className="count-display">今日の頑張り: {count}回</div>

      {/* 頑張ったボタン */}
      <button onClick={handleClick} className={`ganbatta-button ${isAnimating ? "animating" : ""}`}>
        <span className="material-icons button-icon">thumb_up</span>
        頑張った！
      </button>

      {/* フッター：Copyright */}
      <div className="footer">© kusoAppA</div>

      <style>{`
        .ganbatta-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 90vh;
          gap: 40px;
          position: relative;
          padding: 20px;
        }

        .header {
          position: absolute;
          top: 40px;
          left: 40px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .app-title {
          fontSize: 48px;
          font-weight: 800;
          color: #fff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          margin: 0;
        }

        .app-icon {
          font-size: 48px;
          color: #fff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .count-display {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 12px 32px;
          border-radius: 50px;
          backdrop-filter: blur(10px);
        }

        .ganbatta-button {
          font-size: 42px;
          font-weight: 800;
          color: #FF6B35;
          background-color: #fff;
          border: none;
          border-radius: 100px;
          padding: 50px 70px;
          cursor: pointer;
          box-shadow: 0 15px 60px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ganbatta-button:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }

        .ganbatta-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.35);
        }

        .ganbatta-button.animating {
          transform: scale(1.1);
        }

        .button-icon {
          font-size: 56px;
        }

        .praise-area {
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .praise-message {
          font-size: 64px;
          font-weight: 800;
          color: #fff;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          animation: popIn 0.15s ease forwards;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .praise-icon {
          font-size: 64px;
        }

        .footer {
          position: absolute;
          bottom: 20px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* スマートフォン対応 */
        @media (max-width: 768px) {
          .ganbatta-container {
            gap: 20px;
            padding: 10px;
            justify-content: center;
          }

          .header {
            top: 20px;
            left: 20px;
            gap: 8px;
          }

          .app-title {
            font-size: 28px;
          }

          .app-icon {
            font-size: 28px;
          }

          .count-display {
            font-size: 16px;
            padding: 8px 20px;
            position: static;
          }

          .ganbatta-button {
            font-size: 28px;
            padding: 35px 45px;
            gap: 12px;
            position: static;
          }

          .button-icon {
            font-size: 36px;
          }

          .praise-area {
            min-height: 50px;
          }

          .praise-message {
            font-size: 36px;
            gap: 12px;
          }

          .praise-icon {
            font-size: 36px;
          }

          .footer {
            bottom: 10px;
            font-size: 12px;
          }
        }

        /* さらに小さい画面 */
        @media (max-width: 480px) {
          .header {
            top: 15px;
            left: 15px;
            gap: 6px;
          }

          .app-title {
            font-size: 22px;
          }

          .app-icon {
            font-size: 22px;
          }

          .count-display {
            font-size: 14px;
            padding: 6px 16px;
          }

          .ganbatta-button {
            font-size: 24px;
            padding: 30px 40px;
            gap: 10px;
          }

          .button-icon {
            font-size: 32px;
          }

          .praise-area {
            min-height: 40px;
          }

          .praise-message {
            font-size: 28px;
            gap: 10px;
          }

          .praise-icon {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};
