import { useEffect, useState } from 'react';
import { Transaction } from '../types';

const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('/api/transactions'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Transaction[] = await response.json();
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return { transactions, loading, error };
};

export default useTransactions;