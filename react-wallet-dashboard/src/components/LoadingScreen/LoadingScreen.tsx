import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface Props {
    message?: string;
}

export const LoadingScreen: React.FC<Props> = ({ message = 'Loading...' }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                zIndex: (theme) => theme.zIndex.modal + 1,
            }}
        >
            <CircularProgress size={60} thickness={4} />
            <Typography
                variant="h6"
                sx={{
                    mt: 2,
                    color: 'text.secondary',
                    textAlign: 'center',
                    maxWidth: '80%',
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};