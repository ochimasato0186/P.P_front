"use client";
import { useRouter } from "next/navigation";
import TimeButton from "../../components/TimeButton";
import TimeBox from "../../components/TimeBox";
import Road from "../../components/Road";
import { useContext, useEffect, useState } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

type TrueFalseQuestion = {
  type: "trueFalse";
  questionNumber: string;
  text: string;
  difficulty: string;
  category: string;
  answer: string;
  explanation: string;
  reference: string;
};

type MultipleChoiceQuestion = {
  type: "multipleChoice";
  category: string;
  difficulty: string;
  text: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  reference: string;
};

type Question = TrueFalseQuestion | MultipleChoiceQuestion;

export default function QuizPage() {
  const hour = new Date().getHours();
  const frameOn = useContext(FrameContext);
  const router = useRouter();
  const iconBottom = frameOn ? 30 : 66;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        let language = "日本語"; // デフォルト言語
        
        // localStorage から言語を取得
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            language = user?.language || "日本語";
          } catch (e) {
            console.error("Failed to parse user data:", e);
          }
        }

        let response = await fetch(`/api/quiz/load?language=${encodeURIComponent(language)}`);
        if (!response.ok && language !== "日本語") {
          // 未対応言語が選択されている場合は日本語にフォールバック
          response = await fetch(`/api/quiz/load?language=${encodeURIComponent("日本語")}`);
        }

        if (!response.ok) {
          setError("問題の読み込みに失敗しました");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setQuestions(data.questions || []);
        setAnswers(new Array(data.questions?.length || 0).fill(null));
        setLoading(false);
      } catch (err) {
        setError("エラーが発生しました");
        setLoading(false);
      }
    };

    loadQuestions();
  }, [router]);

  if (loading) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <main
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <TimeBox hour={hour} width={260} height={100}>
            問題を読み込み中...
          </TimeBox>
        </main>
        {frameOn && <Road insideFrame={true} />}
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <main
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <TimeBox hour={hour} width={260} height={100}>
            {error || "問題が見つかりません"}
          </TimeBox>
          <button
            onClick={() => router.push("/home")}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: "#007AFF",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            ホームに戻る
          </button>
        </main>
        {frameOn && <Road insideFrame={true} />}
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isTrueFalse = currentQuestion.type === "trueFalse";
  const isMultipleChoice = currentQuestion.type === "multipleChoice";
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = async (value: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);

    const isCorrect =
      currentQuestion.type === "trueFalse"
        ? value === currentQuestion.answer
        : value === currentQuestion.correctAnswer;
    const nextCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(nextCorrectCount);

    if (isLastQuestion) {
      // クイズ完了
      const accuracy = Math.round((nextCorrectCount / questions.length) * 100);
      try {
        const uid = auth.currentUser?.uid;
        if (uid) {
          await updateDoc(doc(db, "user", uid), { date: String(accuracy) });
          const stored = localStorage.getItem("user");
          if (stored) {
            const user = JSON.parse(stored);
            localStorage.setItem("user", JSON.stringify({ ...user, date: String(accuracy) }));
          }
        }
      } catch {
        // 保存に失敗しても結果画面への遷移は継続
      }
      router.push("/date");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <main
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          {/* 問題数インジケーター */}
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              fontSize: 14,
              color: "#666",
            }}
          >
            問題 {currentIndex + 1}/{questions.length}
          </div>

          {/* 問題文 */}
          <TimeBox hour={hour} width={260} height={isTrueFalse ? 100 : 180}>
            <div
              style={{
                width: "100%",
                height: "100%",
                fontSize: 14,
                lineHeight: 1.6,
                overflowY: "auto",
                paddingRight: 4,
              }}
            >
              <div>{currentQuestion.text}</div>
              {isMultipleChoice && (
                <div style={{ marginTop: 8 }}>
                  {(currentQuestion as MultipleChoiceQuestion).options.map((option, index) => (
                    <div key={`option-text-${index}`}>
                      {index + 1}，{option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TimeBox>

          {/* 回答ボタン */}
          <div
            style={{
              display: isTrueFalse ? "flex" : "grid",
              gridTemplateColumns: isTrueFalse ? undefined : "repeat(2, minmax(120px, 1fr))",
              gap: 24,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              width: isTrueFalse ? "100%" : 260,
              flexWrap: "wrap",
            }}
          >
            {isTrueFalse ? (
              <>
                <button
                  onClick={() => handleAnswer("〇")}
                  style={{
                    background: `rgba(175, 238, 238, 0.5)`,
                    color: "#fff",
                    borderRadius: 24,
                    padding: "12px 24px",
                    fontSize: 16,
                    border: "2px solid #fff",
                    cursor: "pointer",
                    minWidth: 120,
                    transition: "all 0.2s",
                    fontWeight: "bold",
                  }}
                >
                  〇
                </button>
                <button
                  onClick={() => handleAnswer("✕")}
                  style={{
                    background: `rgba(175, 238, 238, 0.5)`,
                    color: "#fff",
                    borderRadius: 24,
                    padding: "12px 24px",
                    fontSize: 16,
                    border: "2px solid #fff",
                    cursor: "pointer",
                    minWidth: 120,
                    transition: "all 0.2s",
                    fontWeight: "bold",
                  }}
                >
                  ✕
                </button>
              </>
            ) : (
              (currentQuestion as MultipleChoiceQuestion).options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index + 1)}
                  style={{
                    background: `rgba(175, 238, 238, 0.5)`,
                    color: "#fff",
                    borderRadius: 24,
                    padding: "12px 24px",
                    fontSize: 16,
                    border: "2px solid #fff",
                    cursor: "pointer",
                    minWidth: 120,
                    transition: "all 0.2s",
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </button>
              ))
            )}
          </div>

          {/* ナビゲーション */}
          <button
            type="button"
            onClick={() => router.push("/home")}
            aria-label="ホーム画面へ移動"
            style={{ position: "absolute", right: 16, bottom: iconBottom, background: "transparent", border: "none", padding: 0, cursor: "pointer", zIndex: 101 }}
          >
            <IoHomeOutline size={50} />
          </button>
          <button
            type="button"
            onClick={() => router.push("/mypage")}
            aria-label="マイページへ移動"
            style={{ position: "absolute", left: 16, bottom: iconBottom, background: "transparent", border: "none", padding: 0, cursor: "pointer", zIndex: 101 }}
          >
            <MdOutlineDirectionsBike size={50} />
          </button>
        </main>
        {frameOn && <Road insideFrame={true} />}
      </div>
      {!frameOn && <Road insideFrame={false} />}
    </>
  );
}