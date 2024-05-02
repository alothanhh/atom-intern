/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { useEffect, useState } from 'react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useRouter } from 'next/navigation'
import { useSignMessage } from 'wagmi'

import { config } from '../../config'
import { getAccount } from '@wagmi/core'
import { disconnect } from '@wagmi/core'
import Dashboard from '@/components/dashboard'
import { Button } from '@mui/material'

interface LoginRequestBody {
  signature: string | undefined;
  nonce: string;
  public_address: string | undefined;
  chain_id: number | undefined;
}

function Home() {
  const { open } = useWeb3Modal()

  const handleLogin = () => {
    open()
  }

  const { isConnected } = useAccount()

  const [isLogin, setIsLogin] = useState(false)

  // ACCOUNT TO GET CHAIN_ID AND PUBLIC_ADRESS
  const account = getAccount(config);

  const router = useRouter()

  const [mouted, setMouted] = useState(false);
  useEffect(() => {
    setMouted(true)
  }, [])

  const { data: signMessageData, error, isPending, signMessageAsync, signMessage, variables } = useSignMessage()

  const [nonce, setNonce] = useState<string>('');

  const isErrorWithMessage = (error: any): error is { message: string } =>
    typeof error === "object" &&
    error !== null &&
    typeof error.message === "string";

  const getErrorMessage = (error: unknown): string | undefined => {
    if (isErrorWithMessage(error)) return error.message;
    return typeof error === "string" ? error : undefined;
  };

  // CALL SIGN MESSAGE API WHEN DETECTED CONNECTION
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await fetch(`https://api.inz-dev.esollabs.com/v1/dapp/auth/sign`);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();

        // GET SIGNATURE
        let signature: string;
        try {
          signature = await signMessageAsync({ message: jsonData.data.sign_msg });
        }
        // DISCONNECT WHEN USER REJECTED REQUEST
        catch (error) {
          console.log(getErrorMessage(error));

          await disconnect(config)
        }

        // GET NONCE
        setNonce(jsonData.data.nonce);
      } catch (error) {
        // Handle error
      }
    };
    if (isConnected && !isLogin) {
      getMessage();
    }
  }, [isConnected])

  // LOGIN WHEN HAVING SIGN MASSAGE
  useEffect(() => {
    const login = async (userData: LoginRequestBody): Promise<any> => {
      try {
        const response = await fetch('https://api.inz-dev.esollabs.com/v1/dapp/auth/sign_in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        return await response.json();
      } catch (error) {
        // Handle error
        throw new Error('Login failed');
      }
    };

    if (signMessageData !== undefined) {
      login({
        "signature": signMessageData,
        "nonce": nonce,
        "public_address": account.address,
        "chain_id": account.chainId,
      })
        .then((response) => {
          console.log('Login successful!');
          console.log('Response:', response);
          localStorage.setItem('user', JSON.stringify(response.data))
          setIsLogin(true)
          // router.push('/dashboard');
        })
        .catch((error) => {
          console.error('Login failed:', error.message);
        });
    }
  }, [signMessageData])

  useEffect(() => {
    const userLogin = localStorage.getItem('user')

    if (userLogin) setIsLogin(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isConnected) {
      setIsLogin(false)
      localStorage.removeItem('user')
    }
  })

  // const userLogin = localStorage.getItem('user')

  // console.log(userLogin)

  //   if (userLogin !== null) {
  //     return <Dashboard />;
  // }

  if (isLogin) return <Dashboard />

  return (
    mouted &&
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 10, fontSize: '32px', fontWeight: '600' }}>
        Souvenir Website 
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
        <div style={{ marginRight: '10px' }}>
          <w3m-network-button />
        </div>
        <div>
          <Button sx={{
            padding: '10px',
            borderRadius: '30px',
            color: 'white',
            border: '0px solid gray',
            background: 'linear-gradient(to right bottom, #36EAEF, #6B0AC9)',
            fontWeight: '600',
            '&:hover': {
              color: 'white',
              backgroundColor: 'rgb(102, 125, 255)',
              opacity: "0.8"
            }
          }} onClick={handleLogin}>Đăng nhập</Button>
        </div>
      </div>
    </div>
  )
}

export default Home;