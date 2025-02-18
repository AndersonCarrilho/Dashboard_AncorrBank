import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpRight, Copy, Download } from "lucide-react";
import { createTransaction } from "@/lib/bitcoin";

interface TransactionCreatorProps {
  onStatusChange?: (status: { type: string; message: string }) => void;
}

const TransactionCreator = ({ onStatusChange }: TransactionCreatorProps) => {
  const [wif, setWif] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [transaction, setTransaction] = useState<any>(null);

  const { toast } = useToast();

  const handleCreateTransaction = async () => {
    setIsCreating(true);
    onStatusChange?.({ type: "loading", message: "Creating transaction..." });

    try {
      const tx = await createTransaction({
        wif,
        destAddress,
        amount: parseInt(amount),
        fee: parseInt(fee),
      });

      setTransaction(tx);
      onStatusChange?.({
        type: "success",
        message: `Transaction created successfully. Fee: ${tx.fee} satoshis`,
      });

      // Save transaction details
      const txData = {
        hex: tx.hex,
        fee: tx.fee,
        change: tx.change,
        utxos: tx.selectedUTXOs,
      };

      const blob = new Blob([JSON.stringify(txData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tx-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      onStatusChange?.({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create transaction",
      });
      toast({
        title: "Transaction Creation Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create transaction",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-green-300">Private Key (WIF)</Label>
          <Input
            type="password"
            value={wif}
            onChange={(e) => setWif(e.target.value)}
            className="bg-black border-green-500/50 text-white font-mono"
            placeholder="Enter your private key in WIF format"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-green-300">Destination Address</Label>
          <Input
            value={destAddress}
            onChange={(e) => setDestAddress(e.target.value)}
            className="bg-black border-green-500/50 text-white font-mono"
            placeholder="Enter the recipient's Bitcoin address"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-green-300">Amount (satoshis)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-black border-green-500/50 text-white font-mono"
            placeholder="Enter amount in satoshis"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-green-300">Fee (satoshis)</Label>
          <Input
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="bg-black border-green-500/50 text-white font-mono"
            placeholder="Enter transaction fee in satoshis"
          />
        </div>

        <Button
          onClick={handleCreateTransaction}
          disabled={isCreating || !wif || !destAddress || !amount || !fee}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
        >
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Create Transaction
        </Button>
      </div>

      {transaction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-green-300">Raw Transaction (Hex)</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={transaction.hex}
                className="bg-black border-green-500/50 text-white font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(transaction.hex)}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-green-300">Fee</Label>
              <Input
                readOnly
                value={`${transaction.fee} satoshis`}
                className="bg-black border-green-500/50 text-white font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-green-300">Change</Label>
              <Input
                readOnly
                value={`${transaction.change} satoshis`}
                className="bg-black border-green-500/50 text-white font-mono"
              />
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              const blob = new Blob([JSON.stringify(transaction, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `tx-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Transaction Details
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default TransactionCreator;
