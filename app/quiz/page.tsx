"use client";
import { useRouter } from "next/navigation";
import TimeButton from "../../components/TimeButton";
import TimeBox from "../../components/TimeBox";
import Road from "../../components/Road";
import { useContext } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";

export default function QuizPage() {
  const hour = new Date().getHours();
  const frameOn = useContext(FrameContext);
  const router = useRouter();
  const iconBottom = frameOn ? 30 : 66;
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
          <TimeBox hour={hour} width={260} height={100}>問題文</TimeBox>
          {/* ボタン2つを横並び中央配置 */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TimeButton label="A" hour={hour} value={1} style={{ minWidth: 120 }} onClick={(val) => alert(`Aの値: ${val}`)} />
            <TimeButton label="B" hour={hour} value={2} style={{ minWidth: 120 }} onClick={(val) => alert(`Bの値: ${val}`)} />
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