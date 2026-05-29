type RoadProps = {
  insideFrame?: boolean;
};

export default function Road({ insideFrame = false }: RoadProps) {
  // フレーム内ならabsolute、外ならfixed
  const isFrame = insideFrame;
  return (
    <div
      style={{
        position: isFrame ? "absolute" : "fixed",
        bottom: 0,
        left: 0,
        width: isFrame ? "100%" : "100vw",
        height: isFrame ? "8%" : "8vw",
        minHeight: "18px",
        maxHeight: isFrame ? "32px" : "48px",
        backgroundColor: "#4a5a5f",
        zIndex: 100,
        borderBottomLeftRadius: isFrame ? "0 0 28px 28px" : undefined,
        borderBottomRightRadius: isFrame ? "0 0 28px 28px" : undefined,
      }}
    >
      {/* 白い破線 */}
            <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: isFrame ? "0.8em" : "0.8vw",
          minHeight: "2px",
          maxHeight: isFrame ? "4px" : "6px",
          transform: "translateY(-50%)",
          background:
            "repeating-linear-gradient(to right, white 0 20%, transparent 20% 40%)",
        }}
      />
    </div>
  );
}