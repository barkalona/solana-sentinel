import React, { useMemo } from 'react';
import {
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    TooltipProps
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { Transaction } from '../../types';
import dayjs from 'dayjs';

interface Props {
    transactions: Transaction[];
}

interface ChartData {
    date: string;
    volume: number;
    count: number;
}

const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload, label }) => {
    const theme = useTheme();
    
    if (!active || !payload || !payload.length) {
        return null;
    }

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                p: 1.5,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                boxShadow: theme.shadows[3],
            }}
        >
            <Typography variant="subtitle2" gutterBottom>
                {label}
            </Typography>
            <Box sx={{ color: '#8884d8' }}>
                Volume: {payload[0].value.toFixed(4)} SOL
            </Box>
            <Box sx={{ color: '#82ca9d' }}>
                Transactions: {payload[1].value}
            </Box>
        </Box>
    );
};

export const BarChart: React.FC<Props> = ({ transactions }) => {
    const theme = useTheme();

    const data = useMemo(() => {
        const grouped = transactions.reduce<Record<string, ChartData>>((acc, tx) => {
            const date = dayjs(tx.date).format('MM/DD');
            if (!acc[date]) {
                acc[date] = {
                    date,
                    volume: 0,
                    count: 0
                };
            }
            acc[date].volume += tx.amount;
            acc[date].count += 1;
            return acc;
        }, {});

        return Object.values(grouped).sort((a, b) => 
            dayjs(a.date, 'MM/DD').unix() - dayjs(b.date, 'MM/DD').unix()
        );
    }, [transactions]);

    if (transactions.length === 0) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={400}
            >
                <Typography variant="body1" color="text.secondary">
                    No transaction data available
                </Typography>
            </Box>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <RechartsBarChart data={data}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.palette.divider}
                />
                <XAxis
                    dataKey="date"
                    stroke={theme.palette.text.primary}
                    tickLine={false}
                />
                <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#8884d8"
                    tickLine={false}
                    label={{ 
                        value: 'Volume (SOL)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: '#8884d8' }
                    }}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#82ca9d"
                    tickLine={false}
                    label={{ 
                        value: 'Transaction Count',
                        angle: 90,
                        position: 'insideRight',
                        style: { fill: '#82ca9d' }
                    }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                    yAxisId="left"
                    dataKey="volume"
                    name="Volume (SOL)"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                />
                <Bar
                    yAxisId="right"
                    dataKey="count"
                    name="Transaction Count"
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                />
            </RechartsBarChart>
        </ResponsiveContainer>
    );
};