import DashboardClientLinks from "../components/DashboardLinks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Switches",
  icons: [{ url: "/favicon.ico", sizes: "any" }],
  robots: "index, follow",
};

export default function index() {
  return <DashboardClientLinks />;
}
