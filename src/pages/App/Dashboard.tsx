import { motion } from "framer-motion";
import { FileText, Hash, Users, Clock, Plus, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import Navigation from "@Features/shared/components/Navigation";
import { useWallet } from "@/contexts/WalletContext";
import { ethereumService } from "@/lib/ethereum";

interface WalletData {
    name: string;
    timestamp: number;
    isActive: boolean;
}

interface DocumentData {
    name: string;
    hash: string;
    status: string;
    timestamp: string;
    registrant: string;
    transactionHash: string;
}

const Dashboard = () => {
    const { isConnected, address } = useWallet();
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [isWalletRegistered, setIsWalletRegistered] = useState(false);
    const [recentDocuments, setRecentDocuments] = useState<DocumentData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [networkStatus, setNetworkStatus] = useState({
        gasPrice: "Loading...",
        blockHeight: "Loading...",
        chainId: "Loading..."
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filteredDocuments = recentDocuments.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.hash.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        {
            title: "Total Documents",
            value: recentDocuments.length.toString(),
            change: "+12%",
            icon: <FileText className="h-5 w-5" />
        },
        {
            title: "Verified Documents",
            value: recentDocuments.filter(doc => doc.status === "Verified").length.toString(),
            change: "+8%",
            icon: <Hash className="h-5 w-5" />
        },
        {
            title: "Wallet Status",
            value: isWalletRegistered ? "Registered" : "Not Registered",
            change: isWalletRegistered ? "+100%" : "0%",
            icon: <Users className="h-5 w-5" />
        },
        {
            title: "Network",
            value: networkStatus.chainId === "10" ? "Optimism" : "Unknown",
            change: "0%",
            icon: <Clock className="h-5 w-5" />
        }
    ];

    const formatTimestamp = (timestamp: number): string => {
        const now = Date.now();
        const diff = now - (timestamp * 1000);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                await ethereumService.initializeReadOnly();

                if (isConnected && address) {
                    const registered = await ethereumService.isWalletRegistered(address);
                    setIsWalletRegistered(registered);

                    if (registered) {
                        const data = await ethereumService.getRegistrant(address);
                        setWalletData(data);
                    }

                    const registrations = await ethereumService.getAllDocumentRegistrations(address);
                    const documents: DocumentData[] = registrations.map(reg => ({
                        name: reg.filename,
                        hash: `${reg.hash.slice(0, 6)}...${reg.hash.slice(-4)}`,
                        status: "Verified",
                        timestamp: formatTimestamp(reg.timestamp),
                        registrant: reg.registrantName || walletData?.name || "Unknown",
                        transactionHash: reg.transactionHash
                    }));

                    setRecentDocuments(documents);

                    const provider = ethereumService.getProvider();
                    if (provider) {
                        const network = await provider.getNetwork();
                        const feeData = await provider.getFeeData();
                        const blockNumber = await provider.getBlockNumber();

                        setNetworkStatus({
                            gasPrice: feeData.gasPrice ? `${(Number(feeData.gasPrice) / 1e9).toFixed(2)} GWEI` : "N/A",
                            blockHeight: blockNumber.toLocaleString(),
                            chainId: network.chainId.toString()
                        });
                    }
                } else {
                    const registrations = await ethereumService.getAllDocumentRegistrations();
                    const documents: DocumentData[] = registrations.slice(0, 10).map(reg => ({
                        name: reg.filename,
                        hash: `${reg.hash.slice(0, 6)}...${reg.hash.slice(-4)}`,
                        status: "Verified",
                        timestamp: formatTimestamp(reg.timestamp),
                        registrant: reg.registrantName || "Anonymous",
                        transactionHash: reg.transactionHash
                    }));
                    setRecentDocuments(documents);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isConnected, address, walletData?.name]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container mx-auto py-8">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please connect your wallet to view the dashboard.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto py-8 space-y-8">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                            {walletData?.name && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-primary">{walletData.name}</span>
                                    {address && (
                                        <Badge variant="outline" className="text-xs">
                                            {address.slice(0, 6)}...{address.slice(-4)}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-muted-foreground">
                            Manage your digital signatures and document verification
                        </p>
                    </div>
                    <Link to={"/app/upload"}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button size="lg" className="gap-2" disabled={!isWalletRegistered}>
                                <Plus className="h-4 w-4" />
                                New Document
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                {!isWalletRegistered && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Your wallet is not registered. Please register your wallet to start using the platform.
                        </AlertDescription>
                    </Alert>
                )}

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {stats.map((stat, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <div className="text-primary">{stat.icon}</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {loading ? "Loading..." : stat.value}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Recent Documents</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search..."
                                                className="pl-8 w-64"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Loading documents...
                                    </div>
                                ) : filteredDocuments.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        {searchTerm ? "No documents match your search." : "No documents found. Upload your first document to get started."}
                                    </div>
                                ) : (
                                    filteredDocuments.map((doc, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => window.open(`https://optimistic.etherscan.io/tx/${doc.transactionHash}`, '_blank')}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{doc.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {doc.hash} • {doc.registrant}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge
                                                    variant={doc.status === "Verified" ? "default" : "secondary"}
                                                    className="mb-1"
                                                >
                                                    {doc.status}
                                                </Badge>
                                                <p className="text-xs text-muted-foreground">{doc.timestamp}</p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Link to="/app/upload">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                            disabled={!isWalletRegistered}
                                        >
                                            <FileText className="h-4 w-4" />
                                            Upload Document
                                        </Button>
                                    </motion.div>
                                </Link>
                                <Link to="/app/verify">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="outline" className="w-full justify-start gap-2">
                                            <Hash className="h-4 w-4" />
                                            Verify Hash
                                        </Button>
                                    </motion.div>
                                </Link>
                                <Link to="/app/register">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                            disabled={isWalletRegistered}
                                        >
                                            <Users className="h-4 w-4" />
                                            {isWalletRegistered ? "Wallet Registered" : "Register Wallet"}
                                        </Button>
                                    </motion.div>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Network Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Optimism Network</span>
                                    <Badge variant={networkStatus.chainId === "10" ? "default" : "destructive"}>
                                        {networkStatus.chainId === "10" ? "Connected" : "Wrong Network"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Gas Price</span>
                                    <span className="text-sm font-medium">{networkStatus.gasPrice}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Block Height</span>
                                    <span className="text-sm font-medium">{networkStatus.blockHeight}</span>
                                </div>
                                {walletData && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Registered Since</span>
                                        <span className="text-sm font-medium">
                                            {new Date(Number(walletData.timestamp) * 1000).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;