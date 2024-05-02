import * as React from 'react'
import { useSignMessage } from 'wagmi'
import { recoverMessageAddress } from 'viem'
import { useState } from 'react'
import { config } from '../../../config'
import { getAccount } from '@wagmi/core'

export function SignMessage() {
    const { data: signMessageData, error, isPending, signMessage, variables } = useSignMessage()

    const [message, setMessage] = useState<string>('')

    const account = getAccount(config)

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', margin: 10 }}>
                <label htmlFor="message" style={{ marginBottom: 10 }}>Enter a message to sign: </label>

                <textarea
                    id="message"
                    name="message"
                    placeholder="Type your message here…"
                    value={message}
                    style={{ height: 150, borderRadius: '30px', padding: 15 }}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button
                    style={{ width: '150px', padding: 10, borderRadius: '30px', marginTop: 10, backgroundColor: 'rgb(102, 125, 255)', color: 'white', border: '0px solid' }}
                    disabled={isPending}
                    onClick={() => signMessage({ message })}>
                    {isPending ? 'Check Wallet' : 'Sign Message'}
                </button>

                {signMessageData && (
                    <div>
                        <div><strong>Signature:</strong> {signMessageData}</div>
                        <div><strong>ChainID:</strong> {account.chainId}</div>
                        <div><strong>Public adress:</strong> {account.address} </div>
                    </div>
                )}

                {error && <div>{error.message}</div>}
            </div>
        </>
    )
}
