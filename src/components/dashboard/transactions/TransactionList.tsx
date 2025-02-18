import React from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";

export interface Transaction {
  hash: string;
  time: string;
  amount: number;
  fee: number;
  inputs: Array<{
    prev_out: {
      addr: string;
      value: number;
    };
  }>;
  out: Array<{
    addr: string;
    value: number;
  }>;
}

interface TransactionListProps {
  transactions?: Transaction[];
}

const TransactionList = ({
  transactions = defaultTransactions,
}: TransactionListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case "receive":
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-green-500/20 bg-black">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-green-400">Type</TableHead>
            <TableHead className="text-green-400">Amount</TableHead>
            <TableHead className="text-green-400">Address</TableHead>
            <TableHead className="text-green-400">Time</TableHead>
            <TableHead className="text-green-400">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, index) => (
            <motion.tr
              key={tx.hash}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group hover:bg-green-500/5"
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {tx.amount > 0 ? getTypeIcon("receive") : getTypeIcon("send")}
                  <span className="capitalize text-gray-300">
                    {tx.amount > 0 ? "receive" : "send"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-gray-300">
                {Math.abs(tx.amount)} BTC
              </TableCell>
              <TableCell className="font-mono text-gray-300">
                {tx.inputs[0]?.prev_out?.addr
                  ? `${tx.inputs[0].prev_out.addr.slice(0, 6)}...${tx.inputs[0].prev_out.addr.slice(-4)}`
                  : "Unknown"}
              </TableCell>
              <TableCell className="text-gray-300">
                {new Date(tx.time).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="bg-green-500/20 text-green-400 capitalize"
                >
                  confirmed
                </Badge>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const defaultTransactions: Transaction[] = [];

export default TransactionList;
