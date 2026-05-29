"use client";
// app/home/page.tsx
import TimeButton from "../../components/TimeButton";
import TimeBox from "../../components/TimeBox";

export default function HomePage() {
  const hour = new Date().getHours();
  return (
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
    </main>
  );
}