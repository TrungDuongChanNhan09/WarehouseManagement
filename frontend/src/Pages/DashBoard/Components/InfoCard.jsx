import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'; // Use appropriate icon

export default function InfoCard({ icon, title, value }) {
  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '200px',
        gap: 1,
        padding: 2,
        borderRadius: 2,
        border: '1px solid #F25D07',
        boxShadow: '5px 5px 5px rgba(255, 166, 0, 0.3)',
        '&:hover': {
          boxShadow: '7px 7px 5px rgba(255, 166, 0, 0.4)',
        },
      }}
    >
      {/* Icon */}
      <Box
        display={'flex'}
        alignItems={'center'}
        sx={{
          color: '#F25D07',
          fontSize: '2rem',
        }}
      >
        {icon || <ShoppingBagIcon/>}
        <Typography marginLeft={'5px'} variant="body1" fontWeight="bold" fontSize={'1.1rem'} color='black'>
          {title || 'Title'}
        </Typography>
      </Box>

      {/* Text */}
      <Box>
        
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#F25D07' }}>
          {value || 0}
        </Typography>
      </Box>
    </Paper>
  );
}