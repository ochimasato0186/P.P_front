"use client";
import { useRouter } from "next/navigation";
import TimeButton from "../../components/TimeButton";
import Road from "../../components/Road";
import { useContext, useEffect, useState } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";
import TimeBox from "../../components/TimeBox";

type Account = {
  language?: string;
};

type LanguageItem = {
  memo?: string;
  language?: string;
  text3?: string;
  text4?: string;
  button4?: string;
};

export default function HomePage() {
  const hour = new Date().getHours();
  const router = useRouter();
  // contextからフレームON/OFF判定（デフォルトtrue）
  const frameOn = useContext(FrameContext);
  const iconBottom = frameOn ? 30 : 66;
  const [quizTitle, setQuizTitle] = useState("自転車クイズ");
  const [startLabel, setStartLabel] = useState("START");
  const [bestScoreLabel, setBestScoreLabel] = useState("最高正答率");

  useEffect(() => {
    const loadTitle = async () => {
      try {
        const languageRes = await fetch("/language.json", { cache: "no-store" });
        if (!languageRes.ok) return;

        const languageData = await languageRes.json();
        let accountLanguage = "";

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser) as Account;
            accountLanguage = parsed?.language ?? "";
          } catch {
            accountLanguage = "";
          }
        }

        if (!accountLanguage) {
          const accountRes = await fetch("/myacount.json", { cache: "no-store" });
          if (accountRes.ok) {
            const accountData = await accountRes.json();
            accountLanguage =
              (Array.isArray(accountData) ? (accountData[0] as Account | undefined) : undefined)?.language ?? "";
          }
        }

        if (!accountLanguage || !Array.isArray(languageData)) return;

        const matched = (languageData as LanguageItem[]).find(
          (item) => item.memo === accountLanguage || item.language === accountLanguage
        );

        if (matched?.text3) {
          setQuizTitle(matched.text3);
        }
        if (matched?.text4) {
          setBestScoreLabel(matched.text4);
        }
        if (matched?.button4) {
          setStartLabel(matched.button4);
        }
      } catch {
        // 表示はデフォルト値のまま継続
      }
    };

    loadTitle();
  }, []);

  return (
    <>
      <div
        style={
          frameOn
            ? { position: "relative", width: "100%", height: "100%" }
            : { position: "relative", width: "100vw", minHeight: "100vh" }
        }
      >
        <main
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h1 style={{ marginBottom: 8 }}>{quizTitle}</h1>
          <div style={{ width: 200, height: 4, background: '#222', borderRadius: 2, marginBottom: 16 }} />
          <TimeButton
            label={startLabel}
            hour={hour}
            style={{ width: 200, height: 50 }}
            onClick={() => router.push("/quiz")}
          />
          <div style={{ height: 24 }} />
          <TimeBox hour={hour} width={260} height={130}>{bestScoreLabel}</TimeBox>
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