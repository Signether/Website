import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

// Contract ABI for your DEHR contract
export const DEHR_ABI = [
    "function registerWallet(string calldata registrantName) external",
    "function registerHash(bytes32 fileHash) external",
    "function isRegistered(bytes32 fileHash) external view returns (bool)",
    "function getRegistration(bytes32 fileHash) external view returns (address, string, uint256)",
    "function isWalletRegistered(address wallet) external view returns (bool)",
    "function getRegistrant(address wallet) external view returns (string, uint256, bool)",
    "event HashRegistered(bytes32 indexed fileHash, address indexed registrant, string indexed registrantName, uint256 timestamp)",
    "event RegistrantRegistered(address indexed wallet, string indexed registrantName, uint256 timestamp)"
];

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Optimism network configuration
export const OPTIMISM_CONFIG = {
    chainId: '0xa', // 10 in hex (lowercase)
    chainName: 'Optimism',
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
};

interface DocumentRegistration {
    hash: string;
    registrant: string;
    registrantName: string;
    timestamp: number;
    blockNumber: number;
    transactionHash: string;
}

export class EthereumService {
    private provider: ethers.BrowserProvider | null = null;
    private signer: ethers.JsonRpcSigner | null = null;
    private contract: ethers.Contract | null = null;
    private readOnlyContract: ethers.Contract | null = null;

    async connectWallet(): Promise<string | null> {
        try {
            const provider = await detectEthereumProvider();

            if (!provider) {
                throw new Error('MetaMask not detected');
            }

            this.provider = new ethers.BrowserProvider(window.ethereum);

            // Request account access
            await this.provider.send("eth_requestAccounts", []);

            this.signer = await this.provider.getSigner();
            const address = await this.signer.getAddress();

            // Initialize contract
            this.contract = new ethers.Contract(CONTRACT_ADDRESS, DEHR_ABI, this.signer);

            // Initialize read-only contract for querying
            const readOnlyProvider = new ethers.JsonRpcProvider('https://mainnet.optimism.io');
            this.readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, DEHR_ABI, readOnlyProvider);

            // Check if we're on the correct network
            await this.switchToOptimism();

            return address;
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            throw error;
        }
    }

    async switchToOptimism(): Promise<void> {
        if (!this.provider) throw new Error('Provider not initialized');

        try {
            await this.provider.send('wallet_switchEthereumChain', [
                { chainId: OPTIMISM_CONFIG.chainId }
            ]);
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await this.provider.send('wallet_addEthereumChain', [OPTIMISM_CONFIG]);
                } catch (addError) {
                    console.error('Failed to add Optimism network:', addError);
                    throw addError;
                }
            } else {
                console.error('Failed to switch to Optimism network:', switchError);
                throw switchError;
            }
        }
    }

    async isWalletRegistered(address: string): Promise<boolean> {
        const contract = this.contract || this.readOnlyContract;
        if (!contract) throw new Error('Contract not initialized');
        return await contract.isWalletRegistered(address);
    }

    async getRegistrant(address: string): Promise<{ name: string; timestamp: number; isActive: boolean }> {
        const contract = this.contract || this.readOnlyContract;
        if (!contract) throw new Error('Contract not initialized');
        const [name, timestamp, isActive] = await contract.getRegistrant(address);
        return { name, timestamp: timestamp.toString(), isActive };
    }

    async registerWallet(name: string): Promise<ethers.ContractTransactionResponse> {
        if (!this.contract) throw new Error('Contract not initialized');
        return await this.contract.registerWallet(name);
    }

    async registerHash(hash: string): Promise<ethers.ContractTransactionResponse> {
        if (!this.contract) throw new Error('Contract not initialized');
        return await this.contract.registerHash(hash);
    }

    async isHashRegistered(hash: string): Promise<boolean> {
        const contract = this.contract || this.readOnlyContract;
        if (!contract) throw new Error('Contract not initialized');
        return await contract.isRegistered(hash);
    }

    async getHashRegistration(hash: string): Promise<{ registrant: string; registrantName: string; timestamp: number }> {
        const contract = this.contract || this.readOnlyContract;
        if (!contract) throw new Error('Contract not initialized');
        const [registrant, registrantName, timestamp] = await contract.getRegistration(hash);
        return { registrant, registrantName, timestamp: timestamp.toString() };
    }

    // New method to fetch all document registrations
    async getAllDocumentRegistrations(userAddress?: string): Promise<DocumentRegistration[]> {
        const contract = this.readOnlyContract || this.contract;
        if (!contract) throw new Error('Contract not initialized');

        try {
            // Query HashRegistered events
            const filter = contract.filters.HashRegistered();
            const events = await contract.queryFilter(filter, -10000); // Last 10k blocks

            const registrations: DocumentRegistration[] = [];

            for (const event of events) {
                if ('args' in event && event.args) {
                    const [fileHash, registrant, registrantName, timestamp] = event.args;

                    // Filter by user address if provided
                    if (userAddress && registrant.toLowerCase() !== userAddress.toLowerCase()) {
                        continue;
                    }

                    registrations.push({
                        hash: fileHash,
                        registrant,
                        registrantName,
                        timestamp: Number(timestamp),
                        blockNumber: event.blockNumber,
                        transactionHash: event.transactionHash
                    });
                }
            }

            // Sort by timestamp (newest first)
            return registrations.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('Error fetching document registrations:', error);
            return [];
        }
    }

    // Get user's document count
    async getUserDocumentCount(userAddress: string): Promise<number> {
        const registrations = await this.getAllDocumentRegistrations(userAddress);
        return registrations.length;
    }

    // Initialize read-only contract for cases where wallet isn't connected
    async initializeReadOnly(): Promise<void> {
        if (!this.readOnlyContract) {
            const readOnlyProvider = new ethers.JsonRpcProvider('https://mainnet.optimism.io');
            this.readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, DEHR_ABI, readOnlyProvider);
        }
    }

    getProvider(): ethers.BrowserProvider | null {
        return this.provider;
    }

    getSigner(): ethers.JsonRpcSigner | null {
        return this.signer;
    }
}

export const ethereumService = new EthereumService();