import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

export const DEHR_ABI = [
    "function registerWallet(string calldata registrantName) external",
    "function registerHash(bytes32 fileHash, string calldata filename) external",
    "function isRegistered(bytes32 fileHash) external view returns (bool)",
    "function getRegistration(bytes32 fileHash) external view returns (address, string, string, uint256)",
    "function isWalletRegistered(address wallet) external view returns (bool)",
    "function getRegistrant(address wallet) external view returns (string, uint256, bool)",
    "function getAllHashesCount() external view returns (uint256)",
    "function getHashByIndex(uint256 index) external view returns (bytes32)",
    "function getUserHashesCount(address user) external view returns (uint256)",
    "function getUserHashByIndex(address user, uint256 index) external view returns (bytes32)",
    "event HashRegistered(bytes32 indexed fileHash, address indexed registrant, string indexed registrantName, string filename, uint256 timestamp)",
    "event RegistrantRegistered(address indexed wallet, string indexed registrantName, uint256 timestamp)"
];

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const OPTIMISM_CONFIG = {
    chainId: '0xa',
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
    filename: string;
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

            await this.provider.send("eth_requestAccounts", []);

            this.signer = await this.provider.getSigner();
            const address = await this.signer.getAddress();

            this.contract = new ethers.Contract(CONTRACT_ADDRESS, DEHR_ABI, this.signer);

            const readOnlyProvider = new ethers.JsonRpcProvider('https://mainnet.optimism.io');
            this.readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, DEHR_ABI, readOnlyProvider);

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
        const result = await contract.getRegistrant(address);

        const name = typeof result[0] === 'string' ? result[0] : result[0].toString();
        const timestamp = typeof result[1] === 'number' ? result[1] : Number(result[1].toString());
        const isActive = Boolean(result[2]);

        return { name, timestamp, isActive };
    }

    async registerWallet(name: string): Promise<ethers.ContractTransactionResponse> {
        if (!this.contract) throw new Error('Contract not initialized');
        return await this.contract.registerWallet(name);
    }

    async registerHash(hash: string, filename: string): Promise<ethers.ContractTransactionResponse> {
        if (!this.contract) throw new Error('Contract not initialized');
        return await this.contract.registerHash(hash, filename);
    }

    async isHashRegistered(hash: string): Promise<boolean> {
        const contract = this.contract || this.readOnlyContract;
        if (!contract) throw new Error('Contract not initialized');
        return await contract.isRegistered(hash);
    }

    async getHashRegistration(hash: string): Promise<{ registrant: string; registrantName: string; filename: string; timestamp: number }> {
        const contract = this.contract || this.readOnlyContract;
        if (!contract) throw new Error('Contract not initialized');
        const result = await contract.getRegistration(hash);

        const registrant = typeof result[0] === 'string' ? result[0] : result[0].toString();
        const registrantName = typeof result[1] === 'string' ? result[1] : result[1].toString();
        const filename = typeof result[2] === 'string' ? result[2] : result[2].toString();
        const timestamp = typeof result[3] === 'number' ? result[3] : Number(result[3].toString());

        return { registrant, registrantName, filename, timestamp };
    }

    async getAllDocumentRegistrations(userAddress?: string): Promise<DocumentRegistration[]> {
        const contract = this.readOnlyContract || this.contract;
        if (!contract) throw new Error('Contract not initialized');

        try {
            const registrations: DocumentRegistration[] = [];

            if (userAddress) {
                const userHashCount = await contract.getUserHashesCount(userAddress);
                console.log(`Found ${userHashCount} hashes for user ${userAddress}`);

                for (let i = 0; i < userHashCount; i++) {
                    try {
                        const hash = await contract.getUserHashByIndex(userAddress, i);
                        const registration = await this.getHashRegistration(hash);

                        registrations.push({
                            hash,
                            registrant: registration.registrant,
                            registrantName: registration.registrantName,
                            filename: registration.filename,
                            timestamp: registration.timestamp,
                            blockNumber: 0,
                            transactionHash: ''
                        });
                    } catch (error) {
                        console.warn(`Failed to get registration for hash at index ${i}:`, error);
                    }
                }
            } else {
                const totalHashCount = await contract.getAllHashesCount();
                console.log(`Found ${totalHashCount} total hashes`);

                for (let i = 0; i < totalHashCount; i++) {
                    try {
                        const hash = await contract.getHashByIndex(i);
                        const registration = await this.getHashRegistration(hash);

                        registrations.push({
                            hash,
                            registrant: registration.registrant,
                            registrantName: registration.registrantName,
                            filename: registration.filename,
                            timestamp: registration.timestamp,
                            blockNumber: 0, // Not available from enumeration
                            transactionHash: '' // Not available from enumeration
                        });
                    } catch (error) {
                        console.warn(`Failed to get registration for hash at index ${i}:`, error);
                    }
                }
            }

            return registrations.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('Error fetching document registrations:', error);
            throw error;
        }
    }

    async getUserDocumentCount(userAddress: string): Promise<number> {
        const contract = this.readOnlyContract || this.contract;
        if (!contract) throw new Error('Contract not initialized');

        try {
            const count = await contract.getUserHashesCount(userAddress);
            return Number(count.toString());
        } catch (error) {
            console.error('Error getting user document count:', error);
            return 0;
        }
    }

    async getTotalDocumentCount(): Promise<number> {
        const contract = this.readOnlyContract || this.contract;
        if (!contract) throw new Error('Contract not initialized');

        try {
            const count = await contract.getAllHashesCount();
            return Number(count.toString());
        } catch (error) {
            console.error('Error getting total document count:', error);
            return 0;
        }
    }

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