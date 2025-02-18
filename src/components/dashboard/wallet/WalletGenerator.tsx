import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Download, RefreshCw } from "lucide-react";
import {
  generateBitcoinWallet,
  type BitcoinWallet,
} from "../../../lib/bitcoin";

interface WalletGeneratorProps {
  onWalletGenerated?: (wallet: BitcoinWallet) => void;
}

const WalletGenerator = ({ onWalletGenerated }: WalletGeneratorProps) => {
  const [wallet, setWallet] = useState<BitcoinWallet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { toast } = useToast();

  const generateWallet = async () => {
    setIsGenerating(true);
    try {
      const walletData = generateBitcoinWallet();
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
    toast({
      title: "Copied to clipboard",
      variant: "default",
    });
  };

  const downloadWalletInfo = () => {
    if (!wallet) return;
    const data =
      `Bitcoin Wallet Information\n\n` +
      `Mnemonic Phrase (KEEP SAFE!):\n${wallet.mnemonic}\n\n` +
      `Addresses:\n` +
      `Native SegWit (Bech32): ${wallet.bech32Address}\n` +
      `Legacy (P2PKH): ${wallet.p2pkhAddress}\n` +
      `SegWit (P2SH): ${wallet.p2shAddress}\n\n` +
      `Private Keys (KEEP SAFE!):\n` +
      `WIF: ${wallet.privateKeyWIF}\n` +
      `WIF (Compressed): ${wallet.privateKeyWIFCompressed}\n` +
      `Hex: ${wallet.privateKeyHex}\n\n` +
      `Public Keys:\n` +
      `Hex: ${wallet.publicKeyHex}\n` +
      `Compressed: ${wallet.publicKeyCompressed}\n\n` +
      `Extended Keys:\n` +
      `xprv (KEEP SAFE!): ${wallet.xprv}\n` +
      `xpub: ${wallet.xpub}`;

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bitcoin-wallet-${wallet.bech32Address.slice(0, 8)}.txt`;
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
          "Generate New Bitcoin Wallet"
        )}
      </Button>

      {wallet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-green-300">Mnemonic Phrase (Seed)</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={wallet.mnemonic}
                className="bg-black border-green-500/50 text-white font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wallet.mnemonic)}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-300">
              Native SegWit Address (Bech32)
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={wallet.bech32Address}
                className="bg-black border-green-500/50 text-white font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wallet.bech32Address)}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-300">Legacy Address (P2PKH)</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={wallet.p2pkhAddress}
                className="bg-black border-green-500/50 text-white font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wallet.p2pkhAddress)}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-300">SegWit Address (P2SH)</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={wallet.p2shAddress}
                className="bg-black border-green-500/50 text-white font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wallet.p2shAddress)}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-300">Private Key (WIF)</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                type="password"
                value={wallet.privateKeyWIF}
                className="bg-black border-green-500/50 text-white font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wallet.privateKeyWIF)}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-300">
              Private Key (WIF Compressed)
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                type="password"
                value={wallet.privateKeyWIFCompressed}
                className="bg-black border-green-500/50 text-white font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wallet.privateKeyWIFCompressed)}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-300">
              Extended Private Key (xprv)
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                type="password"
                value={wallet.xprv}
                className="bg-black border-green-500/50 text-white font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wallet.xprv)}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-300">Extended Public Key (xpub)</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={wallet.xpub}
                className="bg-black border-green-500/50 text-white font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(wallet.xpub)}
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
