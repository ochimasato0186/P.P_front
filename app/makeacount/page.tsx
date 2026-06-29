"use client";

/**
 * 新規アカウント作成画面（フロントエンド）
 * 
 * ユーザーが入力した名前、メール、パスワード、言語選択を取得し、
 * バックエンド（Laravel）の登録APIへリクエストを送信してユーザー登録を行います。
 */

import { useRouter } from "next/navigation";
import TimeButton from "../../components/TimeButton";
import TimeBox, { getTimeBoxColor } from "../../components/TimeBox";
import Road from "../../components/Road";
import { useContext, useEffect, useState } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import { IoHomeOutline, IoRefreshOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";

type LanguageItem = {
  language?: string;
  name?: string;
  text1?: string;
  text2?: string;
  button2?: string;
  button3?: string;
};

export default function QuizPage() {
  const hour = new Date().getHours();
  const frameOn = useContext(FrameContext);
  const router = useRouter();
  const iconBottom = frameOn ? 30 : 66;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [namePlaceholder, setNamePlaceholder] = useState("名前");
  const [emailPlaceholder, setEmailPlaceholder] = useState("メールアドレス");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("パスワード");
  const [registerLabel, setRegisterLabel] = useState("登録");
  const [loginLabel, setLoginLabel] = useState("ログイン");
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageItems, setLanguageItems] = useState<LanguageItem[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [status, setStatus] = useState("");
  const isMorning = hour >= 5 && hour < 10;

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const res = await fetch("/language.json", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        if (!Array.isArray(data)) return;

        setLanguageItems(data as LanguageItem[]);

        const options = Array.from(
          new Set(
            (data as LanguageItem[])
              .map((item) => item?.language)
              .filter((value): value is string => typeof value === "string" && value.length > 0)
          )
        );

        setLanguages(options);
        setSelectedLanguage(options[0] ?? "");
      } catch {
        setLanguages([]);
        setSelectedLanguage("");
      }
    };

    loadLanguages();
  }, []);

  useEffect(() => {
    const matched = languageItems.find((item) => item.language === selectedLanguage);
    setNamePlaceholder(matched?.name || "名前");
    setEmailPlaceholder(matched?.text1 || "メールアドレス");
    setPasswordPlaceholder(matched?.text2 || "パスワード");
    setLoginLabel(matched?.button2 || "ログイン");
    setRegisterLabel(matched?.button3 || "登録");
  }, [languageItems, selectedLanguage]);

  const handleUpdateLanguage = async () => {
    if (!selectedLanguage) {
      setStatus("Language");
      return;
    }

    try {
      const res = await fetch("/api/myacount/language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language: selectedLanguage }),
      });

      if (!res.ok) {
        setStatus("");
        return;
      }

      setStatus("");
    } catch {
      setStatus("");
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !selectedLanguage) {
      setStatus("全ての項目を入力・選択してください。");
      return;
    }

    try {
      setStatus("登録処理中...");
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          const errorMessage = data.errors[firstErrorKey][0];
          setStatus(errorMessage);
        } else {
          setStatus(data.message || "登録に失敗しました。");
        }
        return;
      }

      setStatus("登録に成功しました！");
      localStorage.setItem("access_token", data.access_token);
    } catch {
      setStatus("サーバーとの通信に失敗しました。");
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
          {/* 名前 */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={namePlaceholder}
            style={{
              width: 260,
              height: 44,
              background: getTimeBoxColor(hour),
              border: isMorning ? "2px solid #fff" : "none",
              borderRadius: 4,
              padding: "0 12px",
              color: "#222",
              fontSize: 16,
              outline: "none",
              boxShadow: "none",
              marginBottom: 24,
            }}
          />
          {/* 言語選択 */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            aria-label="言語選択"
            style={{
              width: 285,
              height: 45,
              background: getTimeBoxColor(hour),
              border: isMorning ? "2px solid #fff" : "none",
              borderRadius: 6,
              padding: "0 10px",
              color: "#222",
              fontSize: 14,
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              boxShadow: "none",
              marginBottom: 16,
            }}
          >
            <option value="" disabled>
              Language
            </option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          {status && <p>{status}</p>}
          {/* メールアドレス入力 */}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={emailPlaceholder}
            style={{
              width: 260,
              height: 44,
              background: getTimeBoxColor(hour),
              border: isMorning ? "2px solid #fff" : "none",
              borderRadius: 4,
              padding: "0 12px",
              color: "#222",
              fontSize: 16,
              outline: "none",
              boxShadow: "none",
              marginBottom: 24,
            }}
          />
          {/*パスワード入力 */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={passwordPlaceholder}
            style={{
              width: 260,
              height: 44,
              background: getTimeBoxColor(hour),
              border: isMorning ? "2px solid #fff" : "none",
              borderRadius: 4,
              padding: "0 12px",
              color: "#fff",
              fontSize: 16,
              outline: "none",
              boxShadow: "none",
              marginBottom: 24,
            }}
          />
          <TimeButton
            label={registerLabel}
            hour={hour}
            style={{ width: 200, height: 50, marginBottom: 8 }}
            onClick={handleRegister}
          />
          <TimeButton
            label={loginLabel}
            hour={hour}
            style={{ width: 200, height: 50, marginTop: 0, marginBottom: 24 }}
            onClick={() => { }}
          />


          <button
            type="button"
            onClick={() => router.push("")}
            aria-label="ホーム画面へ移動"
            style={{ position: "absolute", right: 16, bottom: iconBottom, background: "transparent", border: "none", padding: 0, cursor: "pointer", zIndex: 101 }}
          >
            <IoHomeOutline size={50} />
          </button>
          <button
            type="button"
            onClick={() => router.push("")}
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