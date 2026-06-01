"use client";
import { useRouter } from "next/navigation";
import Road from "../../components/Road";
import { useContext } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import TimeBox from "../../components/TimeBox";
import TimeButton from "../../components/TimeButton";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";

export default function DatePage() {
  const frameOn = useContext(FrameContext);
  const hour = new Date().getHours();
  const router = useRouter();
  // contextからフレームON/OFF判定（デフォルトtrue）
  const iconBottom = frameOn ? 30 : 66;

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <main style={{ padding: 20 }}>
          {/* 表 横3×縦11 カラム: 問題No、問題、回答 */}
          <div style={{ width: "100%", overflowX: "auto", marginTop: 40, marginBottom: 32 }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 240, tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "40px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "40px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #000", height: 32, background: "#f0f0f0", minWidth: 0, maxWidth: 40 }}>No</th>
                  <th style={{ border: "1px solid #000", height: 32, background: "#f0f0f0" }}>問題</th>
                  <th style={{ border: "1px solid #000", height: 32, background: "#f0f0f0", minWidth: 0, maxWidth: 40 }}>回答</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(11)].map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    <td style={{ border: "1px solid #000", textAlign: "center", minWidth: 0, maxWidth: 40 }}>{rowIdx + 1}</td>
                    <td style={{ border: "1px solid #000", textAlign: "center" }}></td>
                    <td style={{ border: "1px solid #000", textAlign: "center", minWidth: 0, maxWidth: 40 }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TimeBox hour={hour} width={300} height={100} style={{ marginBottom: 4 }}>正答率</TimeBox>
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 0 }}>
            <TimeButton label="RETRY" hour={hour} />
          </div>
          <button
            type="button"
            onClick={() => router.push("/home")}
            aria-label="ホーム画面へ移動"
            style={{ position: "absolute", right: 16, bottom: iconBottom, background: "transparent", border: "none", padding: 0, cursor: "pointer", zIndex: 101 }}
          >
            <IoHomeOutline size={50} />
          </button>
          <button
            type="button"
            onClick={() => router.push("/mypage")}
            aria-label="マイページへ移動"
            style={{ position: "absolute", left: 16, bottom: iconBottom, background: "transparent", border: "none", padding: 0, cursor: "pointer", zIndex: 101 }}
          >
            <MdOutlineDirectionsBike size={50} />
          </button>
        </main>
        {frameOn && <Road insideFrame={true} />}
      </div>
      {!frameOn && <Road insideFrame={false} />}
    </>
  );
}