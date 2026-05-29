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

          {/* 表 横3×縦11 */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
            <table style={{ borderCollapse: "collapse", width: 320 }}>
              <tbody>
                {[...Array(11)].map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    {[...Array(3)].map((_, colIdx) => (
                      <td
                        key={colIdx}
                        style={{ border: "1px solid #888", width: 100, height: 32, textAlign: "center" }}
                      >
                        {/* セル内容 */}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 32 }}>
              <TimeButton
                label="NEXT"
                hour={hour}
                style={
                  {
                    minWidth: 200,
                    minHeight: 56,
                    borderRadius: 999,
                    fontSize: 28,
                    color: "#222",
                    border: "none",
                    letterSpacing: 2,
                  }
                }
              />
            </div>
          </div>
        </main>
        {frameOn && <Road insideFrame={true} />}
      </div>
      {!frameOn && <Road insideFrame={false} />}
    </>
  );
}