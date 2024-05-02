'use client'
import React, { useEffect, useState } from 'react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import { useSwitchChain } from 'wagmi'
import { getChainId } from '@wagmi/core'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CategoriesList from '@/components/common/categories-list';
import { useRouter } from 'next/navigation';

import { getBalance } from '@wagmi/core'
import { config } from '../../../config'
import { Button, Typography } from '@mui/material';
import { getAccount } from '@wagmi/core'

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
    const account = getAccount(config);

    const { chains, switchChain } = useSwitchChain()
    const chainId = getChainId(config)

    // HANDLE TAB
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const [user, setUser] = useState()
    const [balance, setBalance] = useState<any>()

    // running when component mouted and chainId variable has changed
    useEffect(() => {
        const getBalanceAddress = async (address: any) => {
            const balance = await getBalance(config, {
                address: `0x${address.substring(2)}`,
            })
            setBalance(balance)
        }

        const userLogin = String(localStorage.getItem('user'))
        const userJson = JSON.parse(userLogin)

        if (userLogin) {
            setUser(userJson)
            getBalanceAddress(account.address)
        }
    }, [chainId])

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
                    marginRight: '15px'
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
                    textTransform: 'capitalize', height: '45px',
                    marginRight: '15px'
                }}>
                    Balance: {balance.formatted} {balance.symbol}
                </Typography> : null}
                {chainId === 11155111 ? //11155111 is Sepolia ChainID
                    //Etherium
                    <Button style={{
                        padding: '10px',
                        borderRadius: '30px',
                        color: 'white',
                        border: '0px solid gray',
                        background: 'linear-gradient(to right bottom, #CBE7E3, #05999E)',
                        fontWeight: '600',
                        fontSize: '14px',
                        textTransform: 'capitalize',
                    }} key={chains[0].id} onClick={() => { switchChain({ chainId: chains[0].id }) }}>
                        Switch to {chains[0].name}
                    </Button> :
                    //Sepolia
                    <Button style={{
                        padding: '10px',
                        borderRadius: '30px',
                        color: 'white',
                        border: '0px solid gray',
                        background: 'linear-gradient(to right bottom, #CBE7E3, #05999E)',
                        fontWeight: '600',
                        fontSize: '14px',
                        textTransform: 'capitalize'
                    }} key={chains[1].id} onClick={() => { switchChain({ chainId: chains[1].id }) }}>
                        Switch to {chains[1].name}
                    </Button>
                }
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
