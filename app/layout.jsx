// app/layout.jsx
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import dynamic from 'next/dynamic';
import ParticlesBackground from "../components/ParticlesBackground";

// Import the ParticlesBackgroundWrapper with SSR disabled

export const metadata = {
  title: "Next + Supabase Auth",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <ThemeProvider>
          <div className="fixed inset-0 -z-10">
            <ParticlesBackground />
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}