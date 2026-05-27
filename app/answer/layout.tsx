import PhoneFrame from "@/components/PhoneFrame";

// visibleを切り替えてスマホフレームの表示/非表示を制御
const visible = true; // ここをfalseにすると非表示
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PhoneFrame visible={visible}>{children}</PhoneFrame>;
}