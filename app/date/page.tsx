"use client";
import { useRouter } from "next/navigation";
import Road from "../../components/Road";
import { useContext, useEffect, useState } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import TimeBox from "../../components/TimeBox";
import TimeButton from "../../components/TimeButton";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";

type Account = {
  language?: string;
  date?: string;
};

type LanguageItem = {
  memo?: string;
  language?: string;
  text6?: string;
  button5?: string;
};

export default function DatePage() {
  const frameOn = useContext(FrameContext);
  const hour = new Date().getHours();
  const router = useRouter();
  const [accuracyLabel, setAccuracyLabel] = useState("正答率");
  const [accuracyValue, setAccuracyValue] = useState("0%");
  const [retryLabel, setRetryLabel] = useState("RETRY");
  // contextからフレームON/OFF判定（デフォルトtrue）
  const iconBottom = frameOn ? 30 : 66;

  useEffect(() => {
    const loadAccuracyLabel = async () => {
      try {
        const languageRes = await fetch("/language.json", { cache: "no-store" });
        if (!languageRes.ok) return;

        const languageData = await languageRes.json();
        let accountLanguage = "";
        let rawDate = "";

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser) as Account;
            accountLanguage = parsed?.language ?? "";
            rawDate = parsed?.date ?? "";
          } catch {
            accountLanguage = "";
            rawDate = "";
          }
        }

        if (!accountLanguage || !rawDate) {
          const accountRes = await fetch("/myacount.json", { cache: "no-store" });
          if (accountRes.ok) {
            const accountData = await accountRes.json();
            const account = Array.isArray(accountData) ? (accountData[0] as Account | undefined) : undefined;
            if (!accountLanguage) {
              accountLanguage = account?.language ?? "";
            }
            if (!rawDate) {
              rawDate = account?.date ?? "";
            }
          }
        }

        if (typeof rawDate === "string" && rawDate.trim()) {
          const normalized = rawDate.trim().replace(/%$/, "");
          setAccuracyValue(`${normalized}%`);
        }

        if (!accountLanguage || !Array.isArray(languageData)) return;

        const matched = (languageData as LanguageItem[]).find(
          (item) => item.memo === accountLanguage || item.language === accountLanguage
        );

        if (matched?.text6) {
          setAccuracyLabel(matched.text6);
        }
        if (matched?.button5) {
          setRetryLabel(matched.button5);
        }
      } catch {
        // 表示はデフォルト値のまま継続
      }
    };

    loadAccuracyLabel();
  }, []);

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
            padding: 20,
          }}
        >
          <div style={{ width: "min(300px, 100%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <TimeBox hour={hour} width="100%" height={100} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div>{accuracyLabel}</div>
                <div style={{ fontSize: 24, fontWeight: "bold" }}>{accuracyValue}</div>
              </div>
            </TimeBox>
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <TimeButton label={retryLabel} hour={hour} onClick={() => router.push("/quiz")} />
            </div>
          </div>
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