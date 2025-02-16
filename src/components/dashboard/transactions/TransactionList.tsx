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
  id: string;
  type: "send" | "receive" | "pending";
  amount: string;
  address: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
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
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group hover:bg-green-500/5"
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {getTypeIcon(tx.type)}
                  <span className="capitalize text-gray-300">{tx.type}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-gray-300">
                {tx.amount} ETH
              </TableCell>
              <TableCell className="font-mono text-gray-300">
                {tx.address.slice(0, 6)}...{tx.address.slice(-4)}
              </TableCell>
              <TableCell className="text-gray-300">{tx.timestamp}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(tx.status)} capitalize`}
                >
                  {tx.status}
                </Badge>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const defaultTransactions: Transaction[] = [
  {
    id: "1",
    type: "send",
    amount: "0.5",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    timestamp: "2024-03-20 14:30",
    status: "completed",
  },
  {
    id: "2",
    type: "receive",
    amount: "1.2",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    timestamp: "2024-03-20 13:15",
    status: "completed",
  },
  {
    id: "3",
    type: "send",
    amount: "0.3",
    address: "0x7890abcdef1234567890abcdef1234567890abcd",
    timestamp: "2024-03-20 12:45",
    status: "pending",
  },
];

export default TransactionList;
