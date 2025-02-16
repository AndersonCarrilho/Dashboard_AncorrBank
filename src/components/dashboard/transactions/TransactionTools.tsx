import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Search } from "lucide-react";
import TransactionList, { Transaction } from "./TransactionList";

interface TransactionToolsProps {
  onStatusChange?: (status: { type: string; message: string }) => void;
}

const TransactionTools = ({ onStatusChange }: TransactionToolsProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onStatusChange?.({
      type: "loading",
      message: `Searching for transactions matching '${searchQuery}'...`,
    });
    // Simulate search delay
    setTimeout(() => {
      onStatusChange?.({
        type: "success",
        message: `Found transactions matching '${searchQuery}'`,
      });
    }, 1000);
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
                    placeholder="Address or transaction hash"
                    className="bg-black border-green-500/50 text-white"
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
              onClick={() => {
                onStatusChange?.({
                  type: "info",
                  message: "Opening transaction creator...",
                });
              }}
            >
              Create New Transaction
            </Button>
            <Button
              variant="outline"
              className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={() => {
                onStatusChange?.({
                  type: "info",
                  message: "Generating transaction report...",
                });
              }}
            >
              Generate Report
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
    </div>
  );
};

export default TransactionTools;
