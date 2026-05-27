// app/layout.tsx
import PhoneFrame from "@/components/PhoneFrame";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}