"use client";
import TimeButton from "../../components/TimeButton";
import Road from "../../components/Road";
import { useContext } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import TimeBox from "../../components/TimeBox";

export default function HomePage() {
  const hour = new Date().getHours();
  // contextからフレームON/OFF判定（デフォルトtrue）
  const frameOn = useContext(FrameContext);

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
          <h1 style={{ marginBottom: 8 }}>自転車クイズ</h1>//タイトル
          <div style={{ width: 200, height: 4, background: '#222', borderRadius: 2, marginBottom: 16 }} />
          <TimeButton label="START" hour={hour} style={{ width: 200, height: 50 }} />
          <div style={{ height: 24 }} />
          <TimeBox hour={hour} width={260} height={130}>最高正答率</TimeBox>
        </main>
        {frameOn && <Road insideFrame={true} />}
      </div>
      {!frameOn && <Road insideFrame={false} />}
    </>
  );
}