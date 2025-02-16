import React, { useState } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Download, RefreshCw } from "lucide-react";

interface WalletGeneratorProps {
  onWalletGenerated?: (wallet: { address: string; privateKey: string }) => void;
}

const WalletGenerator = ({ onWalletGenerated }: WalletGeneratorProps) => {
  const [wallet, setWallet] = useState<{
    address: string;
    privateKey: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { toast } = useToast();

  const generateWallet = async () => {
    setIsGenerating(true);
    try {
      const newWallet = ethers.Wallet.createRandom();
      const walletData = {
        address: newWallet.address,
        privateKey: newWallet.privateKey,
      };
      setWallet(walletData);
      onWalletGenerated?.(walletData);
    } catch (error) {
      console.error("Error generating wallet:", error);
      toast({
        title: "Wallet Generation Failed",
        description:
          error instanceof Error ? error.message : "Failed to generate wallet",
        variant: "destructive",
      });
    }
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadWalletInfo = () => {
    if (!wallet) return;
    const data = `Address: ${wallet.address}\nPrivate Key: ${wallet.privateKey}`;
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallet-${wallet.address.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-4">
      <Button
        onClick={generateWallet}
        disabled={isGenerating}
        className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
      >
        {isGenerating ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-5 h-5" />
          </motion.div>
        ) : (
          "Generate New Wallet"
        )}
      </Button>

      {wallet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-green-300">Wallet Address</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={wallet.address}
                className="bg-black border-green-500/50 text-white"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wallet.address)}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-300">Private Key</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                type="password"
                value={wallet.privateKey}
                className="bg-black border-green-500/50 text-white"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wallet.privateKey)}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            onClick={downloadWalletInfo}
            variant="outline"
            className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Wallet Info
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default WalletGenerator;
