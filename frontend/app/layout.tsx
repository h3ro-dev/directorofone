import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Director of One - Master Your One-Person Department",
  description: "The intelligent platform that transforms solo operators into efficiency powerhouses. Streamline workflows, automate tasks, and amplify your impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
