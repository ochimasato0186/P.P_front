"use client";
import { useRouter } from "next/navigation";
import Road from "../../components/Road";
import { useContext, useEffect, useState } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";
import TimeBox, { getTimeBoxColor } from "../../components/TimeBox";
import TimeButton from "../../components/TimeButton";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

type Account = {
  name: string;
  email: string;
  language: string;
};

type LanguageItem = {
  language?: string;
};

export default function MyPage() {
  const frameOn = useContext(FrameContext);
  const router = useRouter();
  const iconBottom = frameOn ? 30 : 66;
  const hour = new Date().getHours();
  const isMorning = hour >= 5 && hour < 10;
  const [account, setAccount] = useState<Account | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [status, setStatus] = useState("読み込み中...");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
  // ログインしたユーザーを取得
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    const user = JSON.parse(savedUser);

    setAccount({
      name: user.name,
      email: user.email,
      language: user.language,
    });

    setSelectedLanguage(user.language);
    setStatus("");
  } else {
    setStatus("ログインしてください");
  }

  // language.jsonは今まで通り読み込む
  const loadLanguages = async () => {
    try {
      const res = await fetch("/language.json", {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data: LanguageItem[] = await res.json();

      const languageOptions: string[] = Array.from(
        new Set(
          data
            .map((item: LanguageItem) => item.language)
            .filter(
              (value): value is string =>
                typeof value === "string" && value.length > 0
            )
        )
      );

      setLanguages(languageOptions);
    } catch (e) {
      console.error(e);
    }
  };

  loadLanguages();
}, []);

  const handleSaveLanguage = async () => {
    if (!selectedLanguage) {
      setSaveStatus("言語を選択してください");
      return;
    }

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setSaveStatus("ログインが必要です");
        return;
      }
      await updateDoc(doc(db, "user", uid), { language: selectedLanguage });
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        localStorage.setItem("user", JSON.stringify({ ...user, language: selectedLanguage }));
      }
      setAccount((prev) => (prev ? { ...prev, language: selectedLanguage } : prev));
      setSaveStatus("");
    } catch {
      setSaveStatus("保存に失敗しました");
    }
  };

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <main style={{ padding: 20 }}>
          <h1>マイページ</h1>
          <TimeBox hour={hour} width={260} height={30}>{account?.name || status}</TimeBox>
          <TimeBox hour={hour} width={260} height={30}>{account?.email || status}</TimeBox>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              aria-label="Language"
              style={{
                height: 45,
                width: 285,
                border: "none",
                outline: "none",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                boxShadow: "none",
                borderRadius: 6,
                background: getTimeBoxColor(hour),
                padding: "0 10px",
                color: "#222",
                fontSize: 14,
              }}
            >
              <option value="" disabled>Language</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
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
          <TimeButton
            label="保存"
            hour={hour}
            style={{ width: 200, height: 50 }}
            onClick={handleSaveLanguage}
          />
          {saveStatus && <p>{saveStatus}</p>}
        </main>
        {frameOn && <Road insideFrame={true} />}
      </div>
      {!frameOn && <Road insideFrame={false} />}
    </>
  );
}