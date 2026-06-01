"use client";
import { useRouter } from "next/navigation";
import Road from "../../components/Road";
import { useContext, useEffect, useState } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";
import TimeBox, { getTimeBoxColor } from "../../components/TimeBox";
import TimeButton from "../../components/TimeButton";

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
    const loadData = async () => {
      try {
        const [accountRes, languageRes] = await Promise.all([
          fetch("/myacount.json", { cache: "no-store" }),
          fetch("/language.json", { cache: "no-store" }),
        ]);

        if (!accountRes.ok || !languageRes.ok) {
          setStatus("データの取得に失敗しました");
          return;
        }

        const accountData = await accountRes.json();
        const languageData = await languageRes.json();

        const firstAccount = Array.isArray(accountData) ? accountData[0] : null;
        if (!firstAccount) {
          setAccount(null);
          setStatus("データが空です");
          return;
        }

        const languageOptions = Array.isArray(languageData)
          ? Array.from(
              new Set(
                (languageData as LanguageItem[])
                  .map((item) => item?.language)
                  .filter((value): value is string => typeof value === "string" && value.length > 0)
              )
            )
          : [];

        setLanguages(languageOptions);

        setAccount({
          name: firstAccount.name ?? "",
          email: firstAccount.email ?? "",
          language: firstAccount.language ?? "",
        });

        const initialLanguage = firstAccount.language ?? "";
        setSelectedLanguage(initialLanguage || languageOptions[0] || "");
        setStatus("");
      } catch {
        setAccount(null);
        setLanguages([]);
        setSelectedLanguage("");
        setStatus("データの取得に失敗しました");
      }
    };

    loadData();
  }, []);

  const handleSaveLanguage = async () => {
    if (!selectedLanguage) {
      setSaveStatus("言語を選択してください");
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
        setSaveStatus("保存に失敗しました");
        return;
      }

      setAccount((prev) => (prev ? { ...prev, language: selectedLanguage } : prev));
      setSaveStatus("");
    } catch {
      setSaveStatus("");
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