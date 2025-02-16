import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

interface DashboardCardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
}

const DashboardCard = ({
  title = "Card Title",
  description = "Card description goes here",
  children = "Card content",
  className = "",
  footer,
  onClick,
}: DashboardCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full bg-black border-green-500/50 hover:border-green-400 cursor-pointer",
          "transition-colors duration-200",
          "hover:shadow-lg hover:shadow-green-500/20",
          className,
        )}
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle className="text-green-400">{title}</CardTitle>
          <CardDescription className="text-green-300/70">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-white/90">{children}</CardContent>
        {footer && (
          <CardFooter className="text-green-300/50">{footer}</CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default DashboardCard;
