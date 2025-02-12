export interface Transaction {
    walletAddress: string;
    amount: number;
    date: string;
}

export interface WalletInfo {
    address: string;
    balance: number;
    transactions: Transaction[];
}

export interface ChartData {
    date: string;
    volume: number;
    count: number;
}

export interface TableData {
    id: string;
    date: string;
    amount: number;
    walletAddress: string;
}

export interface TransactionState {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    connected: boolean;
}