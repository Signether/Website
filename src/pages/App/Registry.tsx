import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, Download, Hash, User, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@Features/shared/components/Navigation";
import { ethereumService } from "@/lib/ethereum";

interface RegistrationData {
    id: string;
    hash: string;
    registrant: string;
    registrantName: string;
    timestamp: number;
    blockNumber: number;
    transactionHash: string;
    documentName: string;
    verified: boolean;
}

const Registry = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("all");
    const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            setError(null);

            // Initialize read-only contract
            await ethereumService.initializeReadOnly();

            // Fetch all document registrations using enumeration
            const contractRegistrations = await ethereumService.getAllDocumentRegistrations();

            const formattedRegistrations: RegistrationData[] = contractRegistrations.map((reg, index) => ({
                id: index.toString(),
                hash: reg.hash,
                registrant: reg.registrant,
                registrantName: reg.registrantName || "Anonymous",
                timestamp: reg.timestamp,
                blockNumber: reg.blockNumber,
                transactionHash: reg.transactionHash,
                documentName: reg.filename, // Now using actual filename from contract
                verified: true // All registered hashes are verified
            }));

            console.log('Fetched registrations using enumeration:', formattedRegistrations);

            setRegistrations(formattedRegistrations);
        } catch (err) {
            console.error('Error fetching registrations:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch registrations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch = reg.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.registrantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.documentName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterBy === "all" ||
            (filterBy === "verified" && reg.verified) ||
            (filterBy === "unverified" && !reg.verified);

        return matchesSearch && matchesFilter;
    });

    const exportData = () => {
        const csvContent = [
            ['Hash', 'Registrant', 'Registrant Name', 'Document Name', 'Timestamp', 'Block Number', 'Transaction Hash'],
            ...filteredRegistrations.map(reg => [
                reg.hash,
                reg.registrant,
                reg.registrantName,
                reg.documentName,
                new Date(reg.timestamp * 1000).toISOString(),
                reg.blockNumber.toString(),
                reg.transactionHash
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'registry_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold tracking-tight">Registry Explorer</h1>
                    <p className="text-muted-foreground">
                        Browse and explore all document hashes registered on the DEHR smart contract
                    </p>
                </motion.div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <motion.div
                    className="mb-6 flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by hash, registrant, or document name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={filterBy} onValueChange={setFilterBy}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Registrations</SelectItem>
                            <SelectItem value="verified">Verified Only</SelectItem>
                            <SelectItem value="unverified">Unverified Only</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2" onClick={exportData}>
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Document Registry</CardTitle>
                                <Badge variant="secondary">
                                    {loading ? "Loading..." : `${filteredRegistrations.length} Results`}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                    <p className="text-muted-foreground">Loading registrations from blockchain...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredRegistrations.map((registration, index) => (
                                        <motion.div
                                            key={registration.id}
                                            className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ scale: 1.01 }}
                                            onClick={() => window.open(`https://optimistic.etherscan.io/tx/${registration.transactionHash}`, '_blank')}
                                        >
                                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                                <div className="lg:col-span-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Hash className="h-4 w-4 text-primary" />
                                                        <span className="font-medium">Document Hash</span>
                                                        <Badge
                                                            variant={registration.verified ? "default" : "secondary"}
                                                            className="ml-auto"
                                                        >
                                                            {registration.verified ? "Verified" : "Pending"}
                                                        </Badge>
                                                    </div>
                                                    <p className="font-mono text-sm text-muted-foreground mb-2 break-all">
                                                        {registration.hash}
                                                    </p>
                                                    <p className="text-sm font-medium">{registration.documentName}</p>
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <User className="h-4 w-4 text-primary" />
                                                        <span className="font-medium text-sm">Registrant</span>
                                                    </div>
                                                    <p className="text-sm">{registration.registrantName}</p>
                                                    <p className="font-mono text-xs text-muted-foreground">
                                                        {registration.registrant.slice(0, 10)}...{registration.registrant.slice(-4)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Clock className="h-4 w-4 text-primary" />
                                                        <span className="font-medium text-sm">Registered</span>
                                                    </div>
                                                    <p className="text-sm">
                                                        {formatTimestamp(registration.timestamp)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(registration.hash);
                                                    }}
                                                >
                                                    <Hash className="h-3 w-3" />
                                                    Copy Hash
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {filteredRegistrations.length === 0 && !loading && (
                                        <div className="text-center py-12">
                                            <p className="text-muted-foreground">
                                                {searchTerm || filterBy !== "all"
                                                    ? "No registrations found matching your criteria."
                                                    : "No registrations found. Be the first to register a document!"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Registry;