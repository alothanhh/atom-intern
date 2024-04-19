'use client'
import React, { useEffect } from 'react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CategoriesList from '@/components/categories-list';
import { useRouter } from 'next/navigation';

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

    const router = useRouter()

    useEffect(() => {
        if (!isConnected) router.push('/')
    })

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                <button style={{ padding: '10px', borderRadius: '30px', color: 'white', border: '0px solid gray', backgroundColor: 'rgb(102, 125, 255)', fontWeight: '600' }} onClick={() => open()}>View your account</button>
            </div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{
                    borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center'
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
