
"use client";
import { useRouter } from "next/navigation";
import TimeButton from "../../components/TimeButton";
import Road from "../../components/Road";
import { useContext } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";

export default function HomePage() {
  const hour = new Date().getHours();
  const router = useRouter();
  // contextからフレームON/OFF判定（デフォルトtrue）
  const frameOn = useContext(FrameContext);
  const iconBottom = frameOn ? 30 : 66;

  return (
    <>
      <div
        style={
          frameOn
            ? { position: "relative", width: "100%", height: "100%" }
            : { position: "relative", width: "100vw", minHeight: "100vh" }
        }
      >
        <main
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h1>ホーム画面</h1>
          <p>ここにアプリの内容を書く</p>
          <TimeButton label="テストボタン" hour={hour} />
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