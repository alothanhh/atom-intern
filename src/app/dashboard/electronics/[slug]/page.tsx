import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

async function ElectronicsDetail({ params }: { params: { slug: string } }) {

  const data = await getData(params.slug);

  return (
    <div>
      {data ?
        <div style={{ display: 'flex', width: '100%', alignContent: 'center', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#8DECB4', borderRadius: '30px', width: '50%', padding: '30px' }}>
            <Typography style={{ fontSize: '32px' }}>{data.title}</Typography>
            <Typography style={{ fontWeight: '200' }}>{data.description}</Typography>
            <Typography>Category: {data.category}</Typography>
            <Typography>Price: {data.price}</Typography>
          </Box>
        </div>
        : null
      }
    </div>
  )
}

export default ElectronicsDetail

async function getData(id: any) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}
