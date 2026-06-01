"use client";
import { useRouter } from "next/navigation";
import TimeButton from "../../components/TimeButton";
import TimeBox from "../../components/TimeBox";
import Road from "../../components/Road";
import { useContext } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";

export default function AnswerPage() {
  const hour = new Date().getHours();
  const router = useRouter();
  // contextからフレームON/OFF判定（デフォルトtrue）
  const frameOn = useContext(FrameContext);
  const iconBottom = frameOn ? 30 : 66;

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <main style={{ padding: 20, paddingTop: "calc(20px + 1.5cm)" }}>
          <TimeBox hour={hour} width={260} height={100}>問題文</TimeBox>
          <TimeBox hour={hour} width={260} height={200}>模範解答、回答</TimeBox>
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 40 }}>
            <TimeButton
              label="NEXT"
              hour={hour}
              style={{
                minWidth: 200,
                minHeight: 56,
                borderRadius: 999,
                fontSize: 28,
                color: "#222",
                border: "none",
                letterSpacing: 2,
              }}
            />
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