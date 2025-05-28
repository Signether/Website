import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useWallet } from "@/contexts/WalletContext";
import { Upload as UploadIcon, FileText, X, Wallet, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { WalletConnect } from "@Features/shared/components/WalletConnect";
import CryptoJS from 'crypto-js';
import Navigation from "@Features/shared/components/Navigation";

const Upload = () => {
    const {
        isConnected,
        address,
        isWalletRegistered,
        registrantInfo,
        registerWallet,
        registerHash,
        isLoading,
        error
    } = useWallet();

    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [registrantName, setRegistrantName] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/*': [],
        },
        multiple: true
    });

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const generateFileHash = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const wordArray = CryptoJS.lib.WordArray.create(e.target?.result as ArrayBuffer);
                const hash = CryptoJS.SHA256(wordArray).toString();
                resolve(`0x${hash}`);
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const handleRegisterWallet = async () => {
        if (!registrantName.trim()) return;

        setIsRegistering(true);
        try {
            await registerWallet(registrantName);
        } catch (error) {
            console.error('Failed to register wallet:', error);
        } finally {
            setIsRegistering(false);
        }
    };

    const handleUpload = async () => {
        if (!isConnected || !isWalletRegistered) return;

        setUploading(true);
        setProgress(0);

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const hash = await generateFileHash(file);

                setProgress(((i + 0.5) / files.length) * 100);

                await registerHash(hash, file.name);

                setProgress(((i + 1) / files.length) * 100);
            }

            setFiles([]);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    // If wallet not connected
    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Wallet className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <CardTitle>Connect Your Wallet</CardTitle>
                        <p className="text-muted-foreground">
                            Connect your wallet to upload and register documents on Optimism
                        </p>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <WalletConnect />
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                        <div className="text-xs text-muted-foreground">
                            <p>Supported wallets:</p>
                            <p>• MetaMask</p>
                            <p>• WalletConnect compatible wallets</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isWalletRegistered) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <UserPlus className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <CardTitle>Register Your Wallet</CardTitle>
                        <p className="text-muted-foreground">
                            Register your wallet to start uploading documents to the DEHR
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="wallet-name">Your Registrant Name</Label>
                            <Input
                                id="wallet-name"
                                className="mt-1"
                                placeholder="Enter your registrant name"
                                value={registrantName}
                                onChange={(e) => setRegistrantName(e.target.value)}
                            />
                            <small></small>
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleRegisterWallet}
                            disabled={!registrantName.trim() || isRegistering || isLoading}
                        >
                            {isRegistering || isLoading ? "Registering..." : "Register Wallet"}
                        </Button>
                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}
                        <div className="text-xs text-muted-foreground text-center space-y-1">
                            <p>Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
                            <p>Network: Optimism</p>
                            <p>Gas fee required for registration</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto py-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Upload Documents</h1>
                        <p className="text-muted-foreground">
                            Upload your documents to generate cryptographic hashes and register them on-chain
                        </p>
                        {registrantInfo && (
                            <p className="text-sm text-primary mt-2">
                                Registered as: {registrantInfo.name}
                            </p>
                        )}
                    </div>
                    <WalletConnect />
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                        <p className="text-red-800 text-sm">{error}</p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        className="lg:col-span-2 space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Document Upload</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                                        ? "border-primary bg-primary/5"
                                        : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <UploadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    {isDragActive ? (
                                        <p className="text-lg">Drop the files here...</p>
                                    ) : (
                                        <div>
                                            <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                                            <p className="text-sm text-muted-foreground">
                                                Supports every file type
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {files.length > 0 && (
                                    <motion.div
                                        className="mt-6 space-y-3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <h3 className="font-medium">Selected Files</h3>
                                        {files.map((file, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="font-medium">{file.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(index)}
                                                    disabled={uploading}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                                {uploading && (
                                    <motion.div
                                        className="mt-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">Processing & Registering...</span>
                                            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                                        </div>
                                        <Progress value={progress} className="w-full" />
                                    </motion.div>
                                )}
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
                                <CardTitle>Process Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-full ${files.length > 0 ? 'bg-primary text-primary-foreground' : 'bg-primary/10'} flex items-center justify-center`}>
                                        <span className="text-xs font-bold">1</span>
                                    </div>
                                    <div>
                                        <p className={`font-medium ${files.length > 0 ? '' : 'text-muted-foreground'}`}>Upload Document</p>
                                        <p className="text-xs text-muted-foreground">Select and upload your files</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-full ${uploading ? 'bg-primary text-primary-foreground' : 'bg-muted'} flex items-center justify-center`}>
                                        <span className="text-xs font-bold">2</span>
                                    </div>
                                    <div>
                                        <p className={`font-medium ${uploading ? '' : 'text-muted-foreground'}`}>Generate Hash</p>
                                        <p className="text-xs text-muted-foreground">SHA-256 hash generation</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                        <span className="text-xs font-bold">3</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-muted-foreground">Register On-Chain</p>
                                        <p className="text-xs text-muted-foreground">Submit to DEHR contract</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            className="w-full"
                                            size="lg"
                                            disabled={files.length === 0 || uploading || isLoading}
                                            onClick={handleUpload}
                                        >
                                            {uploading ? "Processing..." : "Upload & Register"}
                                        </Button>
                                    </motion.div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 text-center">
                                    Gas fee estimate: ~0.001 ETH per file
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Security Notice</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Documents are processed locally in your browser. Only cryptographic hashes are stored on-chain.
                                    Your original files never leave your device.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Upload;