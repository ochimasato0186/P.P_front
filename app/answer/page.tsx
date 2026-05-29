"use client";
import TimeButton from "../../components/TimeButton";
import TimeBox from "../../components/TimeBox";

export default function HomePage() {
  const hour = new Date().getHours();
  return (
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
  );
}