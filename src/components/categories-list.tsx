/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Link from 'next/link';

interface Product {
    id: number;
    title: string;
    price: number;
    // Add other properties if needed
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function categoriesList(props: { type: any; }) {
    const { type } = props;

    const [data, setData] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://fakestoreapi.com/products/category/${type}`);
    
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
    
                const jsonData = await response.json();
    
                setData(jsonData);
            } catch (error) {
                setData([]);
            }
        };
    
        fetchData();
    }, []);

    return (
        <>
            <Grid container spacing={2}>
                {
                    data ? data.map((item, index) => (
                        <Grid item xs={3} key={index}>
                            <Link href={`/dashboard/${type}/${item.id}`}>
                                <Item sx={{ width: 150, height: 200, backgroundColor: '#FFF5E0' }}>
                                    {item.title}
                                    <br />
                                    PRICE:{item.price}
                                </Item>
                            </Link>
                        </Grid>
                    ))
                        : null
                }
            </Grid>
        </>
    )
}

export default categoriesList
