
"use client";
import TimeButton from "../../components/TimeButton";
import Road from "../../components/Road";
import { useContext } from "react";
import { FrameContext } from "../../components/PhoneFrame";

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
          <h1>ホーム画面</h1>
          <p>ここにアプリの内容を書く</p>
          <TimeButton label="テストボタン" hour={hour} />
        </main>
        {frameOn && <Road insideFrame={true} />}
      </div>
      {!frameOn && <Road insideFrame={false} />}
    </>
  );
}