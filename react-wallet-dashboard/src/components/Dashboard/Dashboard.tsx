import React, { useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    Button,
    InputAdornment,
    IconButton,
    Link,
    Container
} from '@mui/material';
import { ContentPaste as PasteIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { useTransactions } from '../../hooks/useTransactions';
import { BarChart } from '../BarChart';
import { Table } from '../Table';
import { LoadingScreen } from '../LoadingScreen';

const DEMO_WALLET = 'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg';

export const Dashboard: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const { transactions, loading, error, connected } = useTransactions(walletAddress);

    const handlePasteDemo = () => {
        setWalletAddress(DEMO_WALLET);
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: 'background.default'
        }}>
            {loading && <LoadingScreen message="Fetching transactions..." />}
            <Box sx={{ p: 3, flex: 1 }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Solana Wallet Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Monitor transactions and analyze wallet activity in real-time
                    </Typography>
                    
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                label="Solana Wallet Address"
                                variant="outlined"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handlePasteDemo} edge="end">
                                                <PasteIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handlePasteDemo}
                            >
                                Try Demo Wallet
                            </Button>
                        </Grid>
                    </Grid>

                    {!connected && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Connecting to Solana network...
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Paper>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Transaction History
                                </Typography>
                                <Box sx={{ height: 400 }}>
                                    <BarChart transactions={transactions} />
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Total Transactions
                                </Typography>
                                <Typography variant="h3" color="primary">
                                    {transactions.length}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Total Volume
                                </Typography>
                                <Typography variant="h3" color="primary">
                                    {transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)} SOL
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Average Transaction
                                </Typography>
                                <Typography variant="h3" color="primary">
                                    {transactions.length > 0
                                        ? (transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length).toFixed(2)
                                        : '0.00'} SOL
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Recent Transactions
                                </Typography>
                                <Table transactions={transactions} />
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Box>
            
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[800],
                }}
            >
                <Container maxWidth="sm">
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'Built with '}
                        <Link
                            href="https://solana.com"
                            target="_blank"
                            rel="noopener"
                            color="inherit"
                        >
                            Solana
                        </Link>
                        {' and '}
                        <Link
                            href="https://reactjs.org"
                            target="_blank"
                            rel="noopener"
                            color="inherit"
                        >
                            React
                        </Link>
                        {' • '}
                        <Link
                            href="https://github.com/yourusername/solana-wallet-dashboard"
                            target="_blank"
                            rel="noopener"
                            color="inherit"
                            sx={{ display: 'inline-flex', alignItems: 'center' }}
                        >
                            <GitHubIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            View on GitHub
                        </Link>
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};