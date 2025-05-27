import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Hash, User, Clock, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@Features/shared/components/Navigation";
import { ethereumService } from "@/lib/ethereum";

interface VerificationResult {
    isValid: boolean;
    hash: string;
    registrant: string;
    registrantName: string;
    timestamp: string;
    blockNumber?: number;
    transactionHash?: string;
}

interface RecentVerification {
    hash: string;
    status: "Valid" | "Invalid";
    registrant: string;
    timestamp: string;
}

const Verify = () => {
    const [hashInput, setHashInput] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [recentVerifications, setRecentVerifications] = useState<RecentVerification[]>([]);
    const [networkStats, setNetworkStats] = useState({
        totalHashes: 0,
        verifiedToday: 0,
        successRate: "98.7%",
        avgQueryTime: "1.2s"
    });

    // Initialize read-only contract on component mount
    useEffect(() => {
        ethereumService.initializeReadOnly();
        loadRecentVerifications();
        loadNetworkStats();
    }, []);

    const loadRecentVerifications = async () => {
        try {
            const registrations = await ethereumService.getAllDocumentRegistrations();
            const recent = registrations.slice(0, 3).map(reg => ({
                hash: `${reg.hash.slice(0, 6)}...${reg.hash.slice(-4)}`,
                status: "Valid" as const,
                registrant: reg.registrantName,
                timestamp: formatTimeAgo(reg.timestamp)
            }));
            setRecentVerifications(recent);
        } catch (error) {
            console.error('Failed to load recent verifications:', error);
        }
    };

    const loadNetworkStats = async () => {
        try {
            const registrations = await ethereumService.getAllDocumentRegistrations();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTimestamp = Math.floor(today.getTime() / 1000);

            const verifiedToday = registrations.filter(reg => reg.timestamp >= todayTimestamp).length;

            setNetworkStats({
                totalHashes: registrations.length,
                verifiedToday,
                successRate: "98.7%",
                avgQueryTime: "1.2s"
            });
        } catch (error) {
            console.error('Failed to load network stats:', error);
        }
    };

    const formatTimeAgo = (timestamp: number): string => {
        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp;

        if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            return `${minutes} minutes ago`;
        } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return `${hours} hours ago`;
        } else {
            const days = Math.floor(diff / 86400);
            return `${days} days ago`;
        }
    };

    const validateHash = (hash: string): boolean => {
        // Check if it's a valid hex string (with or without 0x prefix)
        const cleanHash = hash.startsWith('0x') ? hash.slice(2) : hash;
        return /^[a-fA-F0-9]{64}$/.test(cleanHash);
    };

    const handleVerify = async () => {
        if (!hashInput.trim()) {
            setError("Please enter a document hash");
            return;
        }

        // Validate hash format
        if (!validateHash(hashInput.trim())) {
            setError("Invalid hash format. Please enter a valid SHA-256 hash (64 hex characters)");
            return;
        }

        setIsVerifying(true);
        setError(null);
        setVerificationResult(null);

        try {
            // Ensure hash has 0x prefix for contract call
            const formattedHash = hashInput.startsWith('0x') ? hashInput : `0x${hashInput}`;

            // Check if hash is registered
            const isRegistered = await ethereumService.isHashRegistered(formattedHash);

            if (isRegistered) {
                // Get registration details
                const registration = await ethereumService.getHashRegistration(formattedHash);

                setVerificationResult({
                    isValid: true,
                    hash: formattedHash,
                    registrant: registration.registrant,
                    registrantName: registration.registrantName,
                    timestamp: new Date(registration.timestamp * 1000).toISOString()
                });
            } else {
                setVerificationResult({
                    isValid: false,
                    hash: formattedHash,
                    registrant: "",
                    registrantName: "",
                    timestamp: ""
                });
            }

            // Refresh recent verifications after a successful query
            loadRecentVerifications();

        } catch (error: any) {
            console.error('Verification failed:', error);
            setError(error.message || "Failed to verify hash. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isVerifying && hashInput.trim()) {
            handleVerify();
        }
    };

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
                        Verify the authenticity and registration status of document hashes on the Optimism blockchain
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
                                            placeholder="0x8f4e9c12a3b7d5e6f8901234567890abcdef1234567890abcdef1234567890ab"
                                            value={hashInput}
                                            onChange={(e) => setHashInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="font-mono text-sm"
                                        />
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                onClick={handleVerify}
                                                disabled={!hashInput.trim() || isVerifying}
                                                className="gap-2"
                                            >
                                                <Search className="h-4 w-4" />
                                                {isVerifying ? "Verifying..." : "Verify"}
                                            </Button>
                                        </motion.div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Enter a 64-character hexadecimal string (with or without 0x prefix)
                                    </p>
                                </div>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

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
                                                        <p className="text-xs text-muted-foreground font-mono break-all">
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
                                                        <p className="text-xs text-muted-foreground font-mono">
                                                            {verificationResult.registrant.slice(0, 10)}...{verificationResult.registrant.slice(-8)}
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
                                                        <p className="text-sm font-medium">Network</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Optimism Mainnet
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
                                    {recentVerifications.length > 0 ? (
                                        recentVerifications.map((verification, index) => (
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
                                        ))
                                    ) : (
                                        <p className="text-center text-muted-foreground py-4">
                                            No recent verifications available
                                        </p>
                                    )}
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
                                    <span className="text-sm font-medium">{networkStats.totalHashes}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Verified Today</span>
                                    <span className="text-sm font-medium">{networkStats.verifiedToday}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Success Rate</span>
                                    <span className="text-sm font-medium">{networkStats.successRate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Avg Query Time</span>
                                    <span className="text-sm font-medium">{networkStats.avgQueryTime}</span>
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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => window.open('https://optimistic.etherscan.io', '_blank')}
                                >
                                    View on Etherscan
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