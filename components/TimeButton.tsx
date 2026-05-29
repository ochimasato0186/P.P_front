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
  onClick?: (value?: any) => void;
  hour: number;
  style?: React.CSSProperties;
  value?: any;
};

export default function TimeButton({ label, onClick, hour, style, value }: TimeButtonProps) {
  // 5:00~10:00だけ白いボーダー
  const isMorning = hour >= 5 && hour < 10;
  return (
    <button
      onClick={onClick ? () => onClick(value) : undefined}
      style={{
        background: getButtonColor(hour),
        color: "#fff",
        borderRadius: 24,
        padding: "12px 24px",
        fontSize: 16,
        marginTop: 24,
        cursor: "pointer",
        transition: "background 0.3s, border 0.3s",
        border: isMorning ? "2px solid #fff" : "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        boxShadow: "0 2px 12px #0002",
        ...style,
      }}
    >
      {label}
    </button>
  );
}
