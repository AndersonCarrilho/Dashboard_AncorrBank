import React from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import DashboardGrid from "./DashboardGrid";

interface DashboardLayoutProps {
  activeSection?: string;
  onNavigate?: (path: string) => void;
  status?: {
    type: "success" | "error" | "warning" | "loading" | "idle";
    message: string;
  };
  onStatusChange?: (status: { type: string; message: string }) => void;
}

const DashboardLayout = ({
  activeSection = "wallet",
  onNavigate = () => {},
  status = { type: "idle", message: "System ready" },
  onStatusChange,
}: DashboardLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-screen bg-black overflow-hidden"
    >
      <Sidebar activeSection={activeSection} onNavigate={onNavigate} />
      <main className="flex-1 overflow-auto">
        <DashboardGrid status={status} onStatusChange={onStatusChange} />
      </main>
    </motion.div>
  );
};

export default DashboardLayout;
