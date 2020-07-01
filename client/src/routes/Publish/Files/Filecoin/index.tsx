/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import useOpMiddlewareApi from '../../../../hooks/use-op-middleware-api'
import Spinner from '../../../../components/atoms/Spinner'
import Dropzone from '../../../../components/molecules/Dropzone'
import { formatBytes, pingUrl } from '../../../../utils/utils'
import { ipfsGatewayUri } from '../../../../config'
import Form from './Form'

export default function Filecoin({ addFile }: { addFile(url: string): void }) {
    const {
        uploadFile,
        isOpMiddlewareReady,
        opMiddlewareError,
        opMiddlewareMessage
    } = useOpMiddlewareApi()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [fileSize, setFileSize] = useState('')
    const [fileSizeReceived, setFileSizeReceived] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        setMessage(
            `Adding to IPFS+Filecoin<br />
             <small>${fileSizeReceived || 0}/${fileSize}</small><br />`
        )
    }, [fileSize, fileSizeReceived])

    async function addToOpMiddleware(data: any) {
        try {
            const d = await uploadFile(data, (pe: ProgressEvent) => {
                const loaded = formatBytes(pe.loaded, 0)
                const total = formatBytes(pe.total, 0)
                setFileSizeReceived(`${loaded}`)
                setFileSize(`${total}`)
            })
            console.log(`File added: ${d.cid}`)
            return d.cid
        } catch (error) {
            setError(`Adding failed: ${error.message}`)
            setLoading(false)
        }
    }

    async function handleOnDrop(acceptedFiles: any) {
        if (!acceptedFiles[0]) return

        setLoading(true)
        setError('')

        // Add file to opMiddleware (and IPFS)
        const file = acceptedFiles[0]
        const cid = await addToOpMiddleware(file)
        if (!cid) return

        // Ping gateway url to make it globally available,
        // but store native url in DDO.
        const urlGateway = `${ipfsGatewayUri}/ipfs/${cid}`
        const url = `ipfs://${cid}`
        setMessage('Checking IPFS gateway URL')
        const isAvailable = await pingUrl(urlGateway)
        // add IPFS url to file.url
        isAvailable && addFile(url)
    }

    return (
        <Form
            opMiddlewareMessage={opMiddlewareMessage}
            opMiddlewareError={opMiddlewareError}
            isOpMiddlewareReady={isOpMiddlewareReady}
            error={error}
        >
            {loading ? (
                <Spinner message={message} />
            ) : (
                <Dropzone
                    multiple={false}
                    handleOnDrop={handleOnDrop}
                    disabled={!isOpMiddlewareReady}
                />
            )}
        </Form>
    )
}
