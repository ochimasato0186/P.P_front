"use client";

import React from "react";

/**
 * 時間帯によって色が変わるボタン
 * @param props.label ボタンのテキスト
 * @param props.onClick クリック時の処理
 * @param props.style 追加スタイル
 */
export function getButtonColor(hour: number) {
  if (hour >= 5 && hour < 10) return "#AFEEEE50";
  if (hour >= 10 && hour < 16) return "#FFFFFF75";
  if (hour >= 16 && hour < 18) return "#FFFFFF50";
  if (hour >= 18 && hour < 19) return "#FDF5E650";
  if (hour >= 19 && hour < 21) return "#FFD70050";
  return "#F0FFF050";
}

export type TimeButtonProps = {
  label: string;
  onClick?: () => void;
  hour: number;
  style?: React.CSSProperties;
};

export default function TimeButton({ label, onClick, hour, style }: TimeButtonProps) {
  // 5:00~10:00だけ白いボーダー
  const isMorning = hour >= 5 && hour < 10;
  return (
    <button
      onClick={onClick}
      style={{
        background: getButtonColor(hour),
        color: "#fff",
        borderRadius: 8,
        padding: "12px 24px",
        fontSize: 16,
        marginTop: 24,
        cursor: "pointer",
        transition: "background 0.3s, border 0.3s",
        ...style,
        border: isMorning ? "2px solid #fff" : "none", // 最後に指定して上書き
      }}
    >
      {label}
    </button>
  );
}
