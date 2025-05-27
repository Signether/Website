import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Home, LayoutDashboard, Upload, Shield, Search, Menu, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/contexts/WalletContext";

const Navigation = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { isConnected, address, connectWallet, disconnectWallet, isLoading, isWalletRegistered } = useWallet();

    const navItems = [
        { path: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
        { path: "/app", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, requiresConnection: true },
        { path: "/app/upload", label: "Upload", icon: <Upload className="h-4 w-4" />, requiresConnection: true },
        { path: "/app/verify", label: "Verify", icon: <Shield className="h-4 w-4" /> },
        { path: "/app/registry", label: "Registry", icon: <Search className="h-4 w-4" /> }
    ];

    const isActive = (path: string) => {
        if (path === "/" && location.pathname !== "/") return false;
        if (path === "/app" && location.pathname !== "/app") return false;
        return location.pathname.startsWith(path);
    };

    const WalletButton = () => {
        if (isConnected && address) {
            return (
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-primary">
                                {address.slice(0, 6)}...{address.slice(-4)}
                            </span>
                        </div>
                        {isWalletRegistered && (
                            <Badge variant="secondary" className="text-xs">
                                Registered
                            </Badge>
                        )}
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={disconnectWallet}
                            className="gap-2 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Disconnect</span>
                        </Button>
                    </motion.div>
                </div>
            );
        }

        return (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                >
                    <Wallet className="h-4 w-4" />
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
            </motion.div>
        );
    };

    const MobileWalletButton = () => {
        if (isConnected && address) {
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-primary">
                                {address.slice(0, 6)}...{address.slice(-4)}
                            </span>
                        </div>
                        {isWalletRegistered && (
                            <Badge variant="secondary" className="text-xs ml-auto">
                                Registered
                            </Badge>
                        )}
                    </div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="outline"
                            className="w-full gap-2 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
                            onClick={() => {
                                disconnectWallet();
                                setIsOpen(false);
                            }}
                        >
                            <LogOut className="h-4 w-4" />
                            Disconnect Wallet
                        </Button>
                    </motion.div>
                </div>
            );
        }

        return (
            <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                    className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80"
                    onClick={() => {
                        connectWallet();
                        setIsOpen(false);
                    }}
                    disabled={isLoading}
                >
                    <Wallet className="h-4 w-4" />
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
            </motion.div>
        );
    };

    return (
        <nav className="border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-3">
                        <motion.div
                            className="flex items-center gap-3"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🖋️</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Signether
                            </span>
                        </motion.div>
                    </Link>

                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const disabled = item.requiresConnection && !isConnected;
                            return (
                                <Link key={item.path} to={disabled ? "#" : item.path}>
                                    <div
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(item.path)
                                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/25"
                                            : disabled
                                                ? "text-muted-foreground/50 cursor-not-allowed"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="text-sm font-medium">{item.label}</span>
                                        {disabled && (
                                            <Badge variant="outline" className="text-xs ml-1 opacity-50">
                                                Connect
                                            </Badge>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden md:block">
                        <WalletButton />
                    </div>

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" size="icon" className="relative">
                                    <Menu className="h-4 w-4" />
                                    {isConnected && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                                    )}
                                </Button>
                            </motion.div>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl">
                            <div className="flex flex-col gap-6 mt-8">
                                <div className="space-y-2">
                                    {navItems.map((item) => {
                                        const disabled = item.requiresConnection && !isConnected;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={disabled ? "#" : item.path}
                                                onClick={() => !disabled && setIsOpen(false)}
                                            >
                                                <div
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                                                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                                                        : disabled
                                                            ? "text-muted-foreground/50 cursor-not-allowed"
                                                            : "hover:bg-accent hover:text-accent-foreground"
                                                        }`}
                                                >
                                                    {item.icon}
                                                    <span className="font-medium">{item.label}</span>
                                                    {disabled && (
                                                        <Badge variant="outline" className="text-xs ml-auto opacity-50">
                                                            Connect
                                                        </Badge>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="pt-6 border-t">
                                    <MobileWalletButton />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;