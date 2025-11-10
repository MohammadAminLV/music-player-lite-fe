import "./globals.css";
import React from "react";
import { ClientProviders } from "../components/ClientProviders";
import { PlayerBar } from "../components/PlayerBar";

export const metadata = {
  title: "Music Player",
  description: "Music player"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg text-slate-900">
        <ClientProviders>
          <div className="app-shell min-h-screen flex flex-col">
            <header className="border-b border-slate-200">
              <div className="container mx-auto px-4 py-4">
                <h1 className="text-xl font-bold">Music Player</h1>
              </div>
            </header>
            <main className="container mx-auto px-4 py-6 flex-1">
              {children}
            </main>
            <PlayerBar />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}