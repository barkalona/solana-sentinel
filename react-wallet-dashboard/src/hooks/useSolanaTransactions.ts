import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { solanaService } from '../services/solana';

export const useSolanaTransactions = (address?: string) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Subscribe to connection status changes
        const unsubscribeConnection = solanaService.onConnectionChange((status) => {
            setIsConnected(status);
        });

        // Subscribe to transaction updates
        let unsubscribeTransactions: (() => void) | undefined;
        
        if (address) {
            unsubscribeTransactions = solanaService.subscribeToWalletTransactions(
                address,
                (transaction: Transaction) => {
                    setTransactions(prev => [transaction, ...prev]);
                }
            );
        }

        // Cleanup subscriptions on unmount
        return () => {
            unsubscribeConnection();
            if (unsubscribeTransactions) {
                unsubscribeTransactions();
            }
        };
    }, [address]);

    // Clear transactions when address changes
    useEffect(() => {
        setTransactions([]);
        setError(null);
    }, [address]);

    return {
        transactions,
        isConnected,
        error
    };
};