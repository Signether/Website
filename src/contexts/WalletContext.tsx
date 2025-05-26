import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethereumService } from '@/lib/ethereum';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within WalletProvider');
    }
    return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [isWalletRegistered, setIsWalletRegistered] = useState(false);
    const [registrantInfo, setRegistrantInfo] = useState<{ name: string; timestamp: number; isActive: boolean } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const walletAddress = await ethereumService.connectWallet();

            if (walletAddress) {
                setAddress(walletAddress);
                setIsConnected(true);

                // Check if wallet is registered
                const registered = await ethereumService.isWalletRegistered(walletAddress);
                setIsWalletRegistered(registered);

                if (registered) {
                    const info = await ethereumService.getRegistrant(walletAddress);
                    setRegistrantInfo(info);
                }
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to connect wallet');
            console.error('Wallet connection error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const disconnectWallet = () => {
        setIsConnected(false);
        setAddress(null);
        setIsWalletRegistered(false);
        setRegistrantInfo(null);
        setError(null);

        // Clear any persisted connection state
        localStorage.removeItem('walletConnected');

        console.log('Wallet disconnected');
    };

    const registerWallet = async (name: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const tx = await ethereumService.registerWallet(name);
            await tx.wait();

            // Update registration status
            setIsWalletRegistered(true);
            if (address) {
                const info = await ethereumService.getRegistrant(address);
                setRegistrantInfo(info);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to register wallet');
            console.error('Wallet registration error:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const registerHash = async (hash: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const tx = await ethereumService.registerHash(hash);
            await tx.wait();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to register hash');
            console.error('Hash registration error:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyHash = async (hash: string): Promise<boolean> => {
        try {
            return await ethereumService.isHashRegistered(hash);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to verify hash');
            console.error('Hash verification error:', err);
            return false;
        }
    };

    const getHashRegistration = async (hash: string) => {
        try {
            return await ethereumService.getHashRegistration(hash);
        } catch (err: unknown) {
            console.error('Failed to get hash registration:', err);
            return null;
        }
    };

    // Check if wallet is already connected on page load
    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum && window.ethereum.selectedAddress) {
                await connectWallet();
            }
        };

        checkConnection();

        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnectWallet();
                } else {
                    connectWallet();
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners();
            }
        };
    }, []);

    return (
        <WalletContext.Provider
            value={{
                isConnected,
                address,
                isWalletRegistered,
                registrantInfo,
                connectWallet,
                disconnectWallet,
                registerWallet,
                registerHash,
                verifyHash,
                getHashRegistration,
                isLoading,
                error,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};