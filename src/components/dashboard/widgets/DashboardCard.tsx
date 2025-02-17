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

import { useMotionTemplate, useMotionValue } from "framer-motion";

const DashboardCard = ({
  title = "Card Title",
  description = "Card description goes here",
  children = "Card content",
  className = "",
  footer,
  onClick,
}: DashboardCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(34, 197, 94, 0.15), transparent 80%)`;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full group"
      onMouseMove={handleMouseMove}
    >
      <Card
        className={cn(
          "relative h-full bg-black border-green-500/50 hover:border-green-400 cursor-pointer",
          "transition-colors duration-200",
          "hover:shadow-lg hover:shadow-green-500/20",
          className,
        )}
        onClick={onClick}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition duration-300 group-hover:opacity-100"
          style={{ background }}
        />
        <CardHeader className="relative z-10">
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
