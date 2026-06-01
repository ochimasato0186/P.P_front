"use client";
import { useRouter } from "next/navigation";
import TimeButton from "../../components/TimeButton";
import Road from "../../components/Road";
import { useContext } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";
import TimeBox from "../../components/TimeBox";

export default function HomePage() {
  const hour = new Date().getHours();
  const router = useRouter();
  // contextからフレームON/OFF判定（デフォルトtrue）
  const frameOn = useContext(FrameContext);
  const iconBottom = frameOn ? 30 : 66;

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
          <h1 style={{ marginBottom: 8 }}>自転車クイズ</h1>
          <div style={{ width: 200, height: 4, background: '#222', borderRadius: 2, marginBottom: 16 }} />
          <TimeButton
            label="START"
            hour={hour}
            style={{ width: 200, height: 50 }}
            onClick={() => router.push("/quiz")}
          />
          <div style={{ height: 24 }} />
          <TimeBox hour={hour} width={260} height={130}>最高正答率</TimeBox>
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