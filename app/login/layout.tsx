
import PhoneFrame from "@/components/PhoneFrame";

const visible = true; // trueで表示、falseで非表示
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PhoneFrame visible={visible}>{children}</PhoneFrame>;
}