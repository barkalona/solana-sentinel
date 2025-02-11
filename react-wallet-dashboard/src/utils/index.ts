// src/utils/index.ts

export const formatTransactionAmount = (amount: number): string => {
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
};

export const fetchTransactionData = async (url: string): Promise<any> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};