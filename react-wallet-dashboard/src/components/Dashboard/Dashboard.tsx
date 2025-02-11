import React, { useEffect, useState } from 'react';
import Table from '../Table';
import BarChart from '../BarChart';
import { Transaction } from '../../types';

const Dashboard: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // Fetch transaction data and update state
        const fetchTransactions = async () => {
            // Simulated fetch function
            const data: Transaction[] = await fetch('/api/transactions').then(res => res.json());
            setTransactions(data);
        };

        fetchTransactions();
    }, []);

    return (
        <div>
            <h1>Wallet Transactions Dashboard</h1>
            <Table data={transactions} />
            <BarChart data={transactions} />
        </div>
    );
};

export default Dashboard;