import DashboardMock from "./components/DashboardMock";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retificadoras",
  icons: [{ url: "/favicon.ico", sizes: "any" }],
  robots: "index, follow",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 mb-20">
      <DashboardMock />
    </main>
  );
}
