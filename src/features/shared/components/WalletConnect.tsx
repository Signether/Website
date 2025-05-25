import { motion } from "framer-motion";
import { Wallet, ExternalLink } from "lucide-react";
import { Button } from "@Components/ui/button";
import { useWallet } from "@/contexts/WalletContext";

export const WalletConnect = () => {
    const { isConnected, address, connectWallet, isLoading } = useWallet();

    if (isConnected && address) {
        return (
            <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://sepolia-optimism.etherscan.io/address/${address}`, '_blank')}
                >
                    <ExternalLink className="h-3 w-3" />
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Button
                onClick={connectWallet}
                disabled={isLoading}
                className="gap-2"
            >
                <Wallet className="h-4 w-4" />
                {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
        </motion.div>
    );
};