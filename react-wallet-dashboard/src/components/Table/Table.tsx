import React, { useState } from 'react';
import {
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TablePagination,
    IconButton,
    Tooltip,
    Link
} from '@mui/material';
import {
    Launch as LaunchIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { Transaction } from '../../types';
import dayjs from 'dayjs';

interface Props {
    transactions: Transaction[];
}

type SortField = 'date' | 'amount';
type SortOrder = 'asc' | 'desc';

export const Table: React.FC<Props> = ({ transactions }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const sortedTransactions = [...transactions].sort((a, b) => {
        const modifier = sortOrder === 'asc' ? 1 : -1;
        if (sortField === 'date') {
            return dayjs(a.date).unix() > dayjs(b.date).unix() ? modifier : -modifier;
        }
        return a[sortField] > b[sortField] ? modifier : -modifier;
    });

    const slicedTransactions = sortedTransactions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (transactions.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary" align="center" py={3}>
                No transactions to display
            </Typography>
        );
    }

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return null;
        return sortOrder === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
    };

    return (
        <>
            <TableContainer>
                <MuiTable>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                onClick={() => handleSort('date')}
                                style={{ cursor: 'pointer' }}
                            >
                                Date {getSortIcon('date')}
                            </TableCell>
                            <TableCell>Wallet Address</TableCell>
                            <TableCell
                                align="right"
                                onClick={() => handleSort('amount')}
                                style={{ cursor: 'pointer' }}
                            >
                                Amount (SOL) {getSortIcon('amount')}
                            </TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {slicedTransactions.map((tx, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {dayjs(tx.date).format('MM/DD/YYYY HH:mm:ss')}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        {tx.walletAddress.slice(0, 4)}...{tx.walletAddress.slice(-4)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    {tx.amount.toFixed(4)}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="View on Solana Explorer">
                                        <IconButton
                                            component={Link}
                                            href={`https://explorer.solana.com/address/${tx.walletAddress}`}
                                            target="_blank"
                                            size="small"
                                        >
                                            <LaunchIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </MuiTable>
            </TableContainer>
            <TablePagination
                component="div"
                count={transactions.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </>
    );
};