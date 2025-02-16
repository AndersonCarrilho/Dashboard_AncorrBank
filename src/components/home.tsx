import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ui/use-toast";
import { useAuth } from "../lib/auth";
import LoginForm from "./auth/LoginForm";
import DashboardLayout from "./dashboard/DashboardLayout";

interface HomeProps {
  initiallyAuthenticated?: boolean;
}

const Home = ({ initiallyAuthenticated = false }: HomeProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    initiallyAuthenticated,
  );
  const [activeSection, setActiveSection] = useState("wallet");
  const [status, setStatus] = useState({
    type: "idle" as const,
    message: "System ready",
  });

  const { toast } = useToast();

  const { signIn, signOut, user } = useAuth();

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      setStatus({ type: "loading", message: "Authenticating..." });
      await signIn(credentials.email, credentials.password);

      setStatus({ type: "success", message: "Login successful" });
      setIsAuthenticated(true);
      toast({
        title: "Welcome back!",
        description: "Successfully logged into the dashboard.",
        variant: "default",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Authentication failed",
      });
      toast({
        title: "Authentication Error",
        description:
          error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    }
  };

  const handleNavigate = async (path: string) => {
    if (path === "logout") {
      await signOut();
      setIsAuthenticated(false);
      setStatus({ type: "idle", message: "System ready" });
      return;
    }

    setActiveSection(path);
    setStatus({
      type: "success",
      message: `Navigated to ${path.charAt(0).toUpperCase() + path.slice(1)}`,
    });
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginForm
              onSubmit={handleLogin}
              isLoading={status.type === "loading"}
              error={status.type === "error" ? status.message : ""}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DashboardLayout
              activeSection={activeSection}
              onNavigate={handleNavigate}
              status={status}
              onStatusChange={setStatus}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
