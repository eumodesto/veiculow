import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ponto Auto Veículos | Seu próximo veículo começa aqui",
  description: "Conheça o estoque da Ponto Auto Veículos e fale com a nossa equipe.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
