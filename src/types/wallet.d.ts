interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    isWalletRegistered: boolean;
    registrantInfo: { name: string; timestamp: number; isActive: boolean } | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    registerWallet: (name: string) => Promise<void>;
    registerHash: (hash: string) => Promise<void>;
    verifyHash: (hash: string) => Promise<boolean>;
    getHashRegistration: (hash: string) => Promise<{ registrant: string; registrantName: string; timestamp: number } | null>;
    isLoading: boolean;
    error: string | null;
}
