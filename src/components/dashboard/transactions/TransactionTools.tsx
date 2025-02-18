import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUpRight, Search, FileSearch } from "lucide-react";
import TransactionList, { Transaction } from "./TransactionList";
import TransactionCreator from "./TransactionCreator";
import { decodeTransaction, fetchRawTxFromTxid } from "@/lib/bitcoin";

interface TransactionToolsProps {
  onStatusChange?: (status: { type: string; message: string }) => void;
}

const TransactionTools = ({ onStatusChange }: TransactionToolsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDecodeDialog, setShowDecodeDialog] = useState(false);
  const [decodedTx, setDecodedTx] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    onStatusChange?.({
      type: "loading",
      message: `Fetching transaction details for '${searchQuery}'...`,
    });

    try {
      let rawTx = searchQuery;
      // If it looks like a TXID, fetch the raw transaction
      if (searchQuery.length === 64 && /^[0-9a-fA-F]+$/.test(searchQuery)) {
        rawTx = await fetchRawTxFromTxid(searchQuery);
      }

      const decoded = decodeTransaction(rawTx);
      setDecodedTx(decoded);
      setShowDecodeDialog(true);
      onStatusChange?.({
        type: "success",
        message: `Transaction decoded successfully`,
      });
    } catch (error) {
      onStatusChange?.({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to decode transaction",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Transaction Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-green-300">Search Transactions</Label>
                <div className="flex gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="TXID or raw transaction hex"
                    className="bg-black border-green-500/50 text-white font-mono"
                  />
                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-black font-semibold"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-black border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={() => setShowCreateDialog(true)}
            >
              Create New Transaction
            </Button>
            <Button
              variant="outline"
              className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={() => setShowDecodeDialog(true)}
            >
              <FileSearch className="w-4 h-4 mr-2" />
              Decode Transaction
            </Button>
          </CardContent>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TransactionList />
      </motion.div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-black border-green-500/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-green-400">
              Create Transaction
            </DialogTitle>
          </DialogHeader>
          <TransactionCreator onStatusChange={onStatusChange} />
        </DialogContent>
      </Dialog>

      <Dialog open={showDecodeDialog} onOpenChange={setShowDecodeDialog}>
        <DialogContent className="bg-black border-green-500/50 max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-green-400">
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto space-y-4 p-4">
            {decodedTx && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 font-mono text-sm"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-green-300">TXID</Label>
                    <Input
                      readOnly
                      value={decodedTx.txid}
                      className="bg-black border-green-500/50 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-green-300">Size (bytes)</Label>
                    <Input
                      readOnly
                      value={decodedTx.size}
                      className="bg-black border-green-500/50 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-green-300">Inputs</Label>
                  {decodedTx.inputs.map((input: any, i: number) => (
                    <div
                      key={i}
                      className="mt-2 p-4 border border-green-500/20 rounded-lg space-y-2"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-green-300 text-xs">
                            Previous TXID
                          </Label>
                          <Input
                            readOnly
                            value={input.txid}
                            className="bg-black border-green-500/50 text-white text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-green-300 text-xs">
                            Output Index
                          </Label>
                          <Input
                            readOnly
                            value={input.vout}
                            className="bg-black border-green-500/50 text-white text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-green-300 text-xs">
                          ScriptSig
                        </Label>
                        <Input
                          readOnly
                          value={input.scriptSig}
                          className="bg-black border-green-500/50 text-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Label className="text-green-300">Outputs</Label>
                  {decodedTx.outputs.map((output: any, i: number) => (
                    <div
                      key={i}
                      className="mt-2 p-4 border border-green-500/20 rounded-lg space-y-2"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-green-300 text-xs">
                            Value (satoshis)
                          </Label>
                          <Input
                            readOnly
                            value={output.value}
                            className="bg-black border-green-500/50 text-white text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-green-300 text-xs">
                            Address
                          </Label>
                          <Input
                            readOnly
                            value={output.address || "Unknown"}
                            className="bg-black border-green-500/50 text-white text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-green-300 text-xs">
                          ScriptPubKey
                        </Label>
                        <Input
                          readOnly
                          value={output.scriptPubKey}
                          className="bg-black border-green-500/50 text-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionTools;
