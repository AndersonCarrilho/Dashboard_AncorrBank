import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";

type StatusType = "success" | "error" | "warning" | "loading" | "idle";

interface StatusIndicatorProps {
  status?: StatusType;
  message?: string;
}

const StatusIndicator = ({
  status = "idle",
  message = "System ready",
}: StatusIndicatorProps) => {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    error: {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    warning: {
      icon: AlertCircle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    loading: {
      icon: Loader2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    idle: {
      icon: CheckCircle,
      color: "text-gray-400",
      bgColor: "bg-gray-500/10",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full h-[60px] ${config.bgColor} bg-opacity-10 backdrop-blur-sm border border-gray-800 rounded-lg flex items-center justify-start px-4 gap-3`}
    >
      <motion.div
        animate={status === "loading" ? { rotate: 360 } : {}}
        transition={{
          duration: 1,
          repeat: status === "loading" ? Infinity : 0,
          ease: "linear",
        }}
      >
        <Icon className={`w-6 h-6 ${config.color}`} />
      </motion.div>
      <span className={`font-medium ${config.color}`}>{message}</span>
    </motion.div>
  );
};

export default StatusIndicator;
