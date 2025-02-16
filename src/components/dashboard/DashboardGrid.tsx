import React, { useState } from "react";
import DashboardCard from "./widgets/DashboardCard";
import StatusIndicator from "./StatusIndicator";
import WalletGenerator from "./wallet/WalletGenerator";
import TransactionTools from "./transactions/TransactionTools";
import SecurityTools from "./security/SecurityTools";
import UserManagement from "./admin/UserManagement";
import { motion } from "framer-motion";
import { Wallet, ArrowUpDown, Shield, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface DashboardGridProps {
  cards?: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
  }>;
  status?: {
    type: "success" | "error" | "warning" | "loading" | "idle";
    message: string;
  };
  onStatusChange?: (status: { type: string; message: string }) => void;
}

const DashboardGrid = ({
  cards: initialCards,
  status = { type: "idle", message: "System ready" },
  onStatusChange,
}: DashboardGridProps) => {
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  const handleWalletGenerated = (wallet: { address: string }) => {
    onStatusChange?.({
      type: "success",
      message: `New wallet generated: ${wallet.address.slice(0, 8)}...`,
    });
    setShowWalletDialog(false);
  };

  const cards = [
    {
      title: "Wallet Management",
      description: "Generate and check wallet balances",
      icon: <Wallet className="w-8 h-8 text-green-400" />,
      onClick: () => setShowWalletDialog(true),
    },
    {
      title: "Transaction Tools",
      description: "Track and generate offline transactions",
      icon: <ArrowUpDown className="w-8 h-8 text-green-400" />,
      onClick: () => setShowTransactionDialog(true),
    },
    {
      title: "Security Features",
      description: "Encrypt and decrypt your data",
      icon: <Shield className="w-8 h-8 text-green-400" />,
      onClick: () => setShowSecurityDialog(true),
    },
    {
      title: "Administrative Controls",
      description: "Manage user settings and access",
      icon: <Settings className="w-8 h-8 text-green-400" />,
      onClick: () => setShowAdminDialog(true),
    },
  ];
  return (
    <div className="w-full h-full bg-black p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DashboardCard
              title={card.title}
              description={card.description}
              onClick={card.onClick}
            >
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                {card.icon}
                <p className="text-green-300/70 text-center mt-4">
                  Click to access {card.title.toLowerCase()}
                </p>
              </div>
            </DashboardCard>
          </motion.div>
        ))}
      </motion.div>

      <div className="fixed bottom-6 left-[280px] right-6">
        <StatusIndicator status={status.type} message={status.message} />
      </div>
      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent className="bg-black border-green-500/50">
          <DialogHeader>
            <DialogTitle className="text-green-400">
              Generate New Wallet
            </DialogTitle>
          </DialogHeader>
          <WalletGenerator onWalletGenerated={handleWalletGenerated} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showTransactionDialog}
        onOpenChange={setShowTransactionDialog}
      >
        <DialogContent className="bg-black border-green-500/50 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-green-400">
              Transaction Tools
            </DialogTitle>
          </DialogHeader>
          <TransactionTools onStatusChange={onStatusChange} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSecurityDialog} onOpenChange={setShowSecurityDialog}>
        <DialogContent className="bg-black border-green-500/50 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-green-400">Security Tools</DialogTitle>
          </DialogHeader>
          <SecurityTools onStatusChange={onStatusChange} />
        </DialogContent>
      </Dialog>

      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="bg-black border-green-500/50 max-w-5xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-green-400">
              User Management
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            <UserManagement onStatusChange={onStatusChange} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardGrid;
