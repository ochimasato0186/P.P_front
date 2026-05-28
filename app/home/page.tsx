// app/home/page.tsx
"use client";
import TimeButton from "../../components/TimeButton";

export default function HomePage() {
  const hour = new Date().getHours();
  return (
    <main style={{ padding: 20 }}>
      <h1>ホーム画面</h1>
      <p>ここにアプリの内容を書く</p>
      <TimeButton label="テストボタン" hour={hour} />
    </main>
  );
}