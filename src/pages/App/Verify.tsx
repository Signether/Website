import { motion } from "framer-motion";
import { useState } from "react";
import { Search, CheckCircle, XCircle, Hash, User, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Navigation from "@Features/shared/components/Navigation";

interface VerificationResult {
    isValid: boolean;
    hash: string;
    registrant: string;
    registrantName: string;
    timestamp: string;
    blockNumber: number;
    transactionHash: string;
}

const Verify = () => {
    const [hashInput, setHashInput] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

    const handleVerify = async () => {
        setIsVerifying(true);

        // Simulate verification process
        setTimeout(() => {
            setVerificationResult({
                isValid: true,
                hash: hashInput,
                registrant: "0x742d35Cc6634C0532925a3b8D4E3C",
                registrantName: "John Doe",
                timestamp: "2024-01-15T10:30:00Z",
                blockNumber: 15234567,
                transactionHash: "0x8f4e...9c12"
            });
            setIsVerifying(false);
        }, 2000);
    };

    const recentVerifications = [
        {
            hash: "0x8f4e...9c12",
            status: "Valid",
            registrant: "Alice Smith",
            timestamp: "2 hours ago"
        },
        {
            hash: "0x7a3d...8b45",
            status: "Valid",
            registrant: "Bob Wilson",
            timestamp: "5 hours ago"
        },
        {
            hash: "0x9e8f...7c23",
            status: "Invalid",
            registrant: "Unknown",
            timestamp: "1 day ago"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto py-8 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold tracking-tight">Verify Documents</h1>
                    <p className="text-muted-foreground">
                        Verify the authenticity and registration status of document hashes on the blockchain
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        className="lg:col-span-2 space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Hash Verification</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="hash">Document Hash (SHA-256)</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="hash"
                                            placeholder="0x8f4e9c12..."
                                            value={hashInput}
                                            onChange={(e) => setHashInput(e.target.value)}
                                            className="font-mono"
                                        />
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                onClick={handleVerify}
                                                disabled={!hashInput || isVerifying}
                                                className="gap-2"
                                            >
                                                <Search className="h-4 w-4" />
                                                {isVerifying ? "Verifying..." : "Verify"}
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>
                                {isVerifying && (
                                    <motion.div
                                        className="flex items-center justify-center py-8"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                            <span>Verifying hash on Optimism network...</span>
                                        </div>
                                    </motion.div>
                                )}
                                {verificationResult && !isVerifying && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="border rounded-lg p-6 space-y-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            {verificationResult.isValid ? (
                                                <CheckCircle className="h-8 w-8 text-green-500" />
                                            ) : (
                                                <XCircle className="h-8 w-8 text-red-500" />
                                            )}
                                            <div>
                                                <h3 className="text-xl font-semibold">
                                                    {verificationResult.isValid ? "Hash Verified" : "Hash Not Found"}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {verificationResult.isValid
                                                        ? "This document hash is registered on the blockchain"
                                                        : "This hash was not found in the registry"
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {verificationResult.isValid && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                                <div className="flex items-center gap-3">
                                                    <Hash className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="text-sm font-medium">Hash</p>
                                                        <p className="text-xs text-muted-foreground font-mono">
                                                            {verificationResult.hash}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <User className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="text-sm font-medium">Registrant</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {verificationResult.registrantName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="text-sm font-medium">Registered</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(verificationResult.timestamp).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="text-sm font-medium">Block</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            #{verificationResult.blockNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Verifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentVerifications.map((verification, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                                            whileHover={{ scale: 1.02 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="flex items-center gap-3">
                                                {verification.status === "Valid" ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                )}
                                                <div>
                                                    <p className="font-mono text-sm">{verification.hash}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {verification.registrant} • {verification.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={verification.status === "Valid" ? "default" : "destructive"}
                                            >
                                                {verification.status}
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>How It Works</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3 text-sm">
                                    <div className="flex gap-3">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold">1</span>
                                        </div>
                                        <p>Enter the SHA-256 hash of your document</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold">2</span>
                                        </div>
                                        <p>System queries the DEHR smart contract</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold">3</span>
                                        </div>
                                        <p>Get verification result with timestamp</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Network Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">Total Hashes</span>
                                    <span className="text-sm font-medium">1,247</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Verified Today</span>
                                    <span className="text-sm font-medium">156</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Success Rate</span>
                                    <span className="text-sm font-medium">98.7%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Avg Query Time</span>
                                    <span className="text-sm font-medium">1.2s</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    Upload New Document
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    View Transaction
                                </Button>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    Export Certificate
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Verify;