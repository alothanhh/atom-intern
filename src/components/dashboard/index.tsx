'use client'
import React, { useEffect, useState } from 'react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CategoriesList from '@/components/common/categories-list';
import { useRouter } from 'next/navigation';

import { getBalance } from '@wagmi/core'
import { config } from '../../../config'
import { Button, Typography } from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Dashboard() {
    const { open } = useWeb3Modal()

    const { isConnected } = useAccount()

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const [balance, setBalance] = useState<any>()

    const getBalanceAddress = async (address: string) => {
        const balance = await getBalance(config, {
            address: `0x${address.substring(2)}`,
        })
        setBalance(balance)
    }

    const [user, setUser] = useState()

    useEffect(() => {
        const userLogin = String(localStorage.getItem('user'))
        const userJson = JSON.parse(userLogin)

        if (userLogin) {
            setUser(userJson)
            getBalanceAddress(userJson.public_address)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const router = useRouter()

    console.log(balance)

    return (
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 10
            }}>
                <Button style={{
                    padding: '10px',
                    borderRadius: '30px',
                    color: 'white',
                    border: '0px solid gray',
                    background: 'linear-gradient(to right bottom, #36EAEF, #6B0AC9)',
                    fontWeight: '600',
                    fontSize: '14px',
                    textTransform: 'capitalize',
                    marginRight:'15px'
                }}
                    onClick={() => open()
                    }>
                    View your account</Button>
                {balance !== undefined ? <Typography sx={{
                    padding: '10px',
                    borderRadius: '30px',
                    color: 'white',
                    border: '0px solid gray',
                    background: 'linear-gradient(to right bottom, #FAA6FF, #E90000)',
                    fontWeight: '600',
                    fontSize: '14px',
                    textTransform: 'capitalize', height:'45px'
                }}>
                    Balance: {balance.formatted} {balance.symbol}
                </Typography> : null}
            </div>

            <Box
                gap={5}
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Jewelery" {...a11yProps(0)} />
                        <Tab label="Electronics" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <CategoriesList type={'jewelery'} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <CategoriesList type={'electronics'} />
                </CustomTabPanel>
            </Box>
        </div>
    )
}

export default Dashboard
