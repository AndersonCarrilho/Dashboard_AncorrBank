import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Unlock, Copy, RefreshCw } from "lucide-react";

interface SecurityToolsProps {
  onStatusChange?: (status: { type: string; message: string }) => void;
}

const SecurityTools = ({ onStatusChange }: SecurityToolsProps) => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const generateKey = () => {
    const newKey = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setKey(newKey);
    onStatusChange?.({
      type: "success",
      message: "New encryption key generated",
    });
  };

  const encrypt = async () => {
    if (!text || !key) return;
    setIsProcessing(true);
    onStatusChange?.({ type: "loading", message: "Encrypting data..." });

    try {
      // Simple XOR encryption for demo (use a proper encryption library in production)
      const encrypted = text
        .split("")
        .map((char, i) => {
          return String.fromCharCode(
            char.charCodeAt(0) ^ key.charCodeAt(i % key.length),
          );
        })
        .join("");
      setResult(btoa(encrypted));
      onStatusChange?.({
        type: "success",
        message: "Data encrypted successfully",
      });
    } catch (error) {
      onStatusChange?.({ type: "error", message: "Encryption failed" });
      toast({
        title: "Encryption Failed",
        description:
          error instanceof Error ? error.message : "Failed to encrypt data",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  const decrypt = async () => {
    if (!text || !key) return;
    setIsProcessing(true);
    onStatusChange?.({ type: "loading", message: "Decrypting data..." });

    try {
      const decoded = atob(text);
      const decrypted = decoded
        .split("")
        .map((char, i) => {
          return String.fromCharCode(
            char.charCodeAt(0) ^ key.charCodeAt(i % key.length),
          );
        })
        .join("");
      setResult(decrypted);
      onStatusChange?.({
        type: "success",
        message: "Data decrypted successfully",
      });
    } catch (error) {
      onStatusChange?.({ type: "error", message: "Decryption failed" });
      toast({
        title: "Decryption Failed",
        description:
          error instanceof Error ? error.message : "Failed to decrypt data",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onStatusChange?.({ type: "success", message: "Copied to clipboard" });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Encryption Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-green-300">Encryption Key</Label>
              <div className="flex gap-2">
                <Input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter or generate key"
                  className="bg-black border-green-500/50 text-white"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(key)}
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={generateKey}
                className="w-full mt-2 bg-green-500 hover:bg-green-600 text-black font-semibold"
              >
                Generate New Key
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Unlock className="w-5 h-5" />
              Encryption/Decryption
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-green-300">Input Text</Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to encrypt/decrypt"
                className="bg-black border-green-500/50 text-white min-h-[100px]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={encrypt}
                disabled={isProcessing}
                className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold"
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                ) : (
                  "Encrypt"
                )}
              </Button>
              <Button
                onClick={decrypt}
                disabled={isProcessing}
                className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold"
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                ) : (
                  "Decrypt"
                )}
              </Button>
            </div>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <Label className="text-green-300">Result</Label>
                <div className="flex gap-2">
                  <Textarea
                    readOnly
                    value={result}
                    className="bg-black border-green-500/50 text-white min-h-[100px]"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result)}
                    className="h-auto border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityTools;
