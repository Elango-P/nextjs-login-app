import "./globals.css";

export const metadata = {
  title: "Next + Supabase Auth",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
