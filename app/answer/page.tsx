"use client";
import TimeButton from "../../components/TimeButton";
import TimeBox from "../../components/TimeBox";
import Road from "../../components/Road";
import { useContext } from "react";
import { FrameContext } from "../../components/PhoneFrame";

export default function AnswerPage() {
  const hour = new Date().getHours();
  const frameOn = useContext(FrameContext);

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <main style={{ padding: 20 }}>
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
        </main>
        {frameOn && <Road insideFrame={true} />}
      </div>
      {!frameOn && <Road insideFrame={false} />}
    </>
  );
}