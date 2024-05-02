'use client'
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface DetailJewelery {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
}

function JeweleryDetail({ params }: { params: { slug: string } }) {

  const [data, setData] = useState<DetailJewelery>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${params.slug}`);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();

        setData(jsonData);
      } catch (error) {
        // Xử lý lỗi nếu có
      }
    };

    fetchData();
  }, [params.slug]);

  return (
    <div>
      {data ?
        <div style={{ display: 'flex', width: '100%', alignContent: 'center', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(to right bottom, #18A5A7, #BFFFC7)', borderRadius: '30px', width: '50%', padding: '30px' }}>
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

export default JeweleryDetail
