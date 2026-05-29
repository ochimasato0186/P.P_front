"use client";
import { useEffect, useState } from "react";
type Props = {
  /**
   * 通常のchildren、またはrender propsとして(bgColor: string, hour: number)を受け取る関数
   */
  children: React.ReactNode | ((bgColor: string, hour: number) => React.ReactNode);
  visible?: boolean;
};

function getBackgroundColor(hour: number) {
    // 5:00~10:00はグラデーション
    if (hour >= 5 && hour < 10) {
        return "linear-gradient(180deg, #F8B862 0%, #1F7299 30%)";
    }
    // 10:00~16:00はグラデーション
    if (hour >= 10 && hour < 16) {
        return "linear-gradient(180deg, #1e90ff 0%, #78CEF0 70%)";
    }
    // 16:00~18:00はグラデーション
    if (hour >= 16 && hour < 18) {
        return "linear-gradient(180deg, #F39800 0%, #5A79BA 30%)";
    } 
    // 18:00~19:00はグラデーション
    if (hour >= 18 && hour < 19) {
        return "linear-gradient(180deg, #F39800 0%, #648888 80%)";
    }
    // 19:00~21:00はグラデーション
    if (hour >= 19 && hour < 21) {
        return "linear-gradient(180deg, #BA55D3 0%, #F4A460 25%, #648888 65%)";
    }
    return "linear-gradient(180deg,  #4169e1 0%, #265780 100%)";// 21:00~5:00
}

export default function PhoneFrame({ children, visible = true }: Props) {
  const [bgColor, setBgColor] = useState(getBackgroundColor(new Date().getHours()));
  const [hour, setHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      const nowHour = new Date().getHours();
      setBgColor(getBackgroundColor(nowHour));
      setHour(nowHour);
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) {
    // フレームなし、背景グラデーションのみ適用
    const isGradient = bgColor.startsWith("linear-gradient");
    const content = typeof children === "function"
      ? (children as (bg: string, hour: number) => React.ReactNode)(bgColor, hour)
      : children;
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: isGradient ? undefined : bgColor,
          backgroundImage: isGradient ? bgColor : undefined,
        }}
      >
        {content}
      </div>
    );
  }
  // グラデーションの場合はbackgroundImageで指定
  const isGradient = bgColor.startsWith("linear-gradient");
  // childrenが関数ならrender propsとして呼び出す
  const content = typeof children === "function" ? (children as (bg: string, hour: number) => React.ReactNode)(bgColor, hour) : children;
  return (
    <div style={styles.wrapper}>
      <div style={styles.frame}>
        <div style={styles.notch} />
        <div
          style={{
            ...styles.screen,
            background: isGradient ? undefined : bgColor,
            backgroundImage: isGradient ? bgColor : undefined,
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    // backgroundはTimeBackgroundで制御
  },
  frame: {
    width: "360px",
    height: "720px",
    padding: "12px",
    borderRadius: "40px",
    background: "#111",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    position: "relative",
  },
  notch: {
    position: "absolute",
    top: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "120px",
    height: "20px",
    background: "#222",
    borderRadius: "10px",
  },
  screen: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: "28px",
    overflow: "hidden",
    background: "#fff",
  },
};