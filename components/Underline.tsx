export default function Road() {
  return (
    <div
      style={{
        position: "absolute", // ← fixed → absolute に変更
        bottom: 0,
        left: 0,
        width: "100%",
        height: "40px",
        backgroundColor: "#4a5a5f",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: "4px",
          transform: "translateY(-50%)",
          background:
            "repeating-linear-gradient(to right, white 0 20px, transparent 20px 40px)",
        }}
      />
    </div>
  );
}