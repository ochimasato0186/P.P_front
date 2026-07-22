"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FrameContext } from "../../components/PhoneFrame";
import Road from "../../components/Road";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDirectionsBike } from "react-icons/md";
import TimeButton from "../../components/TimeButton";
import TimeBox, { getTimeBoxColor } from "../../components/TimeBox";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function QuizPage() {
  const frameOn = useContext(FrameContext);
  const router = useRouter();

  const hour = new Date().getHours();
  const isMorning = hour >= 5 && hour < 10;

  const iconBottom = frameOn ? 30 : 66;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("signup_prefill");
      if (!stored) return;

      const data = JSON.parse(stored) as { email?: string; password?: string };
      if (data.email) {
        setEmail(data.email);
      }
      if (data.password) {
        setPassword(data.password);
      }
      sessionStorage.removeItem("signup_prefill");
    } catch {
      sessionStorage.removeItem("signup_prefill");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const uid = credential.user.uid;

      const snap = await getDoc(doc(db, "user", uid));
      if (!snap.exists()) {
        alert("ユーザー情報が見つかりません。");
        return;
      }

      const userData = snap.data();
      localStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.removeItem("signup_prefill");
      router.push("/home");
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
        alert("メールアドレスまたはパスワードが間違っています。");
      } else {
        alert("ログインに失敗しました。");
      }
    }
  };

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={"メールアドレス"}
            style={{
              width: 260,
              height: 44,
              background: getTimeBoxColor(hour),
              border: isMorning ? "2px solid #fff" : "none",
              borderRadius: 4,
              padding: "0 12px",
              color: "#222",
              fontSize: 16,
              outline: "none",
              boxShadow: "none",
              marginBottom: 24,
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"パスワード"}
            style={{
              width: 260,
              height: 44,
              background: getTimeBoxColor(hour),
              border: isMorning ? "2px solid #fff" : "none",
              borderRadius: 4,
              padding: "0 12px",
              color: "#fff",
              fontSize: 16,
              outline: "none",
              boxShadow: "none",
              marginBottom: 24,
            }}
          />

          <TimeButton
            label={"ログイン"}
            hour={hour}
            style={{ width: 200, height: 50, marginBottom: 8 }}
            onClick={handleLogin}
          />

          <TimeButton
            label={"新規登録"}
            hour={hour}
            style={{ width: 200, height: 50, marginTop: 0, marginBottom: 24 }}
            onClick={() => router.push("/makeacount")}
          />

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