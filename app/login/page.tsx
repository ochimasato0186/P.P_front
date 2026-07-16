
"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import Road from "../../components/Road";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";

export default function QuizPage() {
  const frameOn = useContext(FrameContext);
  const router = useRouter();

  const iconBottom = frameOn ? 30 : 66;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <main
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "85%",
              maxWidth: "320px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "18px",
            }}
          >

            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                fontSize: "18px",
                boxSizing: "border-box",
                color: "#000000",
              }}
            />

            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                fontSize: "18px",
                boxSizing: "border-box",
              }}
            />

            <button
  onClick={() => {
    console.log(email);
    console.log(password);
  }}
  style={{
    width: "85%",
    height: "60px",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: "22px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px",
  }}
>
  ログイン
</button>

<button
              onClick={() => router.push("/register")}
              style={{
                width: "85%",
                height: "60px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "#ffffff",
                color: "#000000",
                fontSize: "22px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "10px",
              }}
              >
              新規登録
            </button>

          </div>

          {/* ホームボタン */}
          <button
            type="button"
            onClick={() => router.push("")}
            aria-label="ホーム画面へ移動"
            style={{
              position: "absolute",
              right: 16,
              bottom: iconBottom,
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              zIndex: 101,
            }}
          >
            <IoHomeOutline size={50} />
          </button>

          {/* 自転車ボタン */}
          <button
            type="button"
            onClick={() => router.push("")}
            aria-label="マイページへ移動"
            style={{
              position: "absolute",
              left: 16,
              bottom: iconBottom,
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              zIndex: 101,
            }}
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