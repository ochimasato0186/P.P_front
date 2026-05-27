type Props = {
  children: React.ReactNode;
  visible?: boolean;
};

export default function PhoneFrame({ children, visible = true }: Props) {
  if (!visible) return null;
  return (
    <div style={styles.wrapper}>
      <div style={styles.frame}>
        <div style={styles.notch} />
        <div style={styles.screen}>
          {children}
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
    background: "#f3f4f6",
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
    width: "100%",
    height: "100%",
    borderRadius: "28px",
    overflow: "hidden",
    background: "#fff",
  },
};