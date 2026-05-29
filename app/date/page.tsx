"use client";
import Road from "../../components/Road";
import { useContext } from "react";
import { FrameContext } from "../../components/PhoneFrame";

export default function DatePage() {
  const frameOn = useContext(FrameContext);
  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <main style={{ padding: 20 }}>
          <h1>結果画面</h1>
          <p>ここにアプリの内容を書く</p>
        </main>
        {frameOn && <Road insideFrame={true} />}
      </div>
      {!frameOn && <Road insideFrame={false} />}
    </>
  );
}