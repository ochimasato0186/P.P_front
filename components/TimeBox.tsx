"use client";
import React, { useEffect, useState } from "react";

// 時間帯によって色が変わる関数（TimeButtonと同じ仕様）
export function getTimeBoxColor(hour: number) {
  if (hour >= 5 && hour < 10) return "#c5c5c550";      // 5:00〜10:00
  if (hour >= 10 && hour < 16) return "#FFFFFF75";     // 10:00〜16:00
  if (hour >= 16 && hour < 18) return "#40e0d050";     // 16:00〜18:00
  if (hour >= 18 && hour < 19) return "#ffe4e150";     // 18:00〜19:00
  if (hour >= 19 && hour < 21) return "#ffe4e150";     // 19:00〜21:00
  return "#ffe4e150";                                  // その他の時間
}

export type TimeBoxProps = {
  children: React.ReactNode;
  hour?: number;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

export default function TimeBox({ children, hour, width = 260, height = 100, style }: TimeBoxProps) {
  const [now, setNow] = useState(hour ?? new Date().getHours());

  useEffect(() => {
    if (hour !== undefined) return; // hourがpropsで指定されている場合は自動更新しない
    const timer = setInterval(() => {
      setNow(new Date().getHours());
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, [hour]);

  const isMorning = now >= 5 && now < 10;
  return (
    <div
      style={{
        width,
        height,
        boxSizing: "border-box",
        background: getTimeBoxColor(now),
        border: isMorning ? "2px solid #fff" : "none",
        borderRadius: 4,
        marginBottom: 40,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 12,
        color: "#222",
        fontSize: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
