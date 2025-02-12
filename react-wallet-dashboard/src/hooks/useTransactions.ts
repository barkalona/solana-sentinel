import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { solanaService } from '../services/solana';

export const useTransactions = (walletAddress: string) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const handleConnectionChange = (status: boolean) => {
            setConnected(status);
            console.log('Connection status:', status);
        };

        // Subscribe to connection status changes
        const unsubscribe = solanaService.onConnectionChange(handleConnectionChange);

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!walletAddress) {
            setTransactions([]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Subscribing to wallet transactions for:', walletAddress);
            const unsubscribe = solanaService.subscribeToWalletTransactions(
                walletAddress,
                (transaction) => {
                    console.log('New transaction:', transaction);
                    setTransactions(prev => [...prev, transaction]);
                }
            );

            return () => {
                console.log('Unsubscribing from wallet transactions for:', walletAddress);
                unsubscribe();
            };
        } catch (err) {
            console.error('Error subscribing to wallet transactions:', err);
            setError(err instanceof Error ? err.message : 'Failed to subscribe to transactions');
        } finally {
            setLoading(false);
        }
    }, [walletAddress]);

    const refetch = () => {
        setTransactions([]);
        if (walletAddress) {
            setLoading(true);
            // Implement refetch logic if needed
            setLoading(false);
        }
    };

    return {
        transactions,
        loading,
        error,
        refetch,
        connected
    };
};