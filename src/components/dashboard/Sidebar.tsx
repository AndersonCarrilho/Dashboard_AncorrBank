import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  ArrowRightLeft,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface SidebarProps {
  activeSection?: string;
  onNavigate?: (path: string) => void;
}

const Sidebar = ({
  activeSection = "wallet",
  onNavigate = () => {},
}: SidebarProps) => {
  const navItems: NavItem[] = [
    { icon: Wallet, label: "Wallet Management", path: "wallet" },
    { icon: ArrowRightLeft, label: "Transaction Tools", path: "transactions" },
    { icon: Shield, label: "Security Features", path: "security" },
    { icon: Settings, label: "Administrative Controls", path: "admin" },
  ];

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="h-full w-[280px] bg-black border-r border-green-500/20 p-4 flex flex-col justify-between"
    >
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-4"
        >
          <h2 className="text-2xl font-bold text-green-400">
            Crypto Dashboard
          </h2>
        </motion.div>

        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <TooltipProvider key={item.path}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors duration-200 ${
                      activeSection === item.path
                        ? "bg-green-500/20 text-green-400"
                        : "text-gray-400 hover:bg-green-500/10 hover:text-green-300"
                    }`}
                    onClick={() => onNavigate(item.path)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        activeSection === item.path ? "rotate-90" : ""
                      }`}
                    />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Navigate to {item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-auto"
      >
        <button
          className="w-full flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
          onClick={() => onNavigate("logout")}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
