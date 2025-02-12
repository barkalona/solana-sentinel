import { Connection, PublicKey } from '@solana/web3.js';
import { Transaction } from '../types';
import dayjs from 'dayjs';

const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const RECONNECT_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 3;

type TransactionCallback = (transaction: Transaction) => void;
type ConnectionCallback = (status: boolean) => void;

interface SubscriptionInfo {
    id: number;
    unsubscribe: () => void;
    retryCount: number;
}

export class SolanaService {
    connection: Connection | null;
    subscriptions: Map<string, SubscriptionInfo>;
    connectionCallbacks: ConnectionCallback[];

    constructor() {
        this.connection = null;
        this.subscriptions = new Map();
        this.connectionCallbacks = [];
        this.setupConnection();
    }

    setupConnection() {
        try {
            console.log('Attempting to establish Solana connection...');
            // Use websocket endpoint for real-time updates
            this.connection = new Connection(SOLANA_RPC_URL.replace('https://', 'wss://'), 'confirmed');
            this.notifyConnectionStatus(true);
            this.resubscribeAll();
            console.log('Solana connection established successfully.');
        } catch (error) {
            console.error('Failed to establish Solana connection:', error);
            this.notifyConnectionStatus(false);
            this.scheduleReconnection();
        }
    }

    scheduleReconnection() {
        setTimeout(() => {
            this.setupConnection();
        }, RECONNECT_INTERVAL);
    }

    resubscribeAll() {
        Array.from(this.subscriptions.entries()).forEach(([address, info]) => {
            if (this.connection) {
                this.subscribeToWalletTransactions(address, (tx) => this.notifyTransaction(tx));
            }
        });
    }

    subscribeToWalletTransactions(wallet: string, callback: TransactionCallback): () => void {
        if (!this.connection) {
            console.error('Cannot subscribe - no connection available');
            return () => {};
        }

        let pubKey: PublicKey;
        try {
            pubKey = new PublicKey(wallet);
        } catch (error) {
            console.error('Invalid wallet address:', error);
            return () => {};
        }

        console.log('Subscribing to wallet transactions for:', wallet);

        // Subscribe to logs for the given wallet address
        const subscriptionId = this.connection.onAccountChange(pubKey, async (accountInfo) => {
            try {
                if (!this.connection) return;

                const signatures = await this.connection.getSignaturesForAddress(pubKey, { limit: 1 });

                if (signatures.length === 0) return;

                const tx = await this.connection.getParsedTransaction(signatures[0].signature, 'confirmed');

                if (!tx?.meta) return;

                const preBalance = tx.meta.preBalances[0] || 0;
                const postBalance = tx.meta.postBalances[0] || 0;
                const balanceChange = Math.abs(postBalance - preBalance) / 1e9;

                if (balanceChange > 0) {
                    const transaction: Transaction = {
                        walletAddress: wallet,
                        amount: balanceChange,
                        date: dayjs(tx.blockTime ? tx.blockTime * 1000 : Date.now()).toISOString()
                    };
                    console.log('New transaction:', transaction);
                    callback(transaction);
                }
            } catch (error) {
                console.error('Error processing transaction:', error);
                this.handleSubscriptionError(wallet);
            }
        });

        const unsubscribe = () => {
            if (this.connection) {
                try {
                    this.connection.removeAccountChangeListener(subscriptionId);
                    this.subscriptions.delete(wallet);
                } catch (error) {
                    console.error('Error unsubscribing from wallet:', error);
                }
            }
        };

        // Store subscription info
        this.subscriptions.set(wallet, {
            id: subscriptionId,
            unsubscribe,
            retryCount: 0
        });

        return unsubscribe;
    }

    handleSubscriptionError(wallet: string) {
        const subInfo = this.subscriptions.get(wallet);
        if (!subInfo) return;

        if (subInfo.retryCount < MAX_RETRIES) {
            console.log(`Retrying subscription for wallet ${wallet}`);
            subInfo.retryCount++;
            subInfo.unsubscribe();
            setTimeout(() => {
                if (this.connection) {
                    this.subscribeToWalletTransactions(wallet, (tx) => this.notifyTransaction(tx));
                }
            }, RECONNECT_INTERVAL);
        } else {
            console.error(`Max retries reached for wallet ${wallet}`);
            subInfo.unsubscribe();
            this.subscriptions.delete(wallet);
        }
    }

    notifyTransaction(transaction: Transaction) {
        this.connectionCallbacks.forEach(callback => {
            try {
                callback(true);
            } catch (error) {
                console.error('Error in connection callback:', error);
            }
        });
    }

    notifyConnectionStatus(status: boolean) {
        this.connectionCallbacks.forEach(callback => {
            try {
                callback(status);
            } catch (error) {
                console.error('Error in connection callback:', error);
            }
        });
    }

    onConnectionChange(callback: ConnectionCallback) {
        this.connectionCallbacks.push(callback);
        return () => {
            const index = this.connectionCallbacks.indexOf(callback);
            if (index > -1) {
                this.connectionCallbacks.splice(index, 1);
            }
        };
    }

    cleanup() {
        // Unsubscribe from all subscriptions
        Array.from(this.subscriptions.values()).forEach(subInfo => {
            subInfo.unsubscribe();
        });
        this.subscriptions.clear();
        this.connection = null;
        this.notifyConnectionStatus(false);
    }
}

export const solanaService = new SolanaService();