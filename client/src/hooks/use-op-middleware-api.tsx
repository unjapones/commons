/* eslint-disable no-console */

import { useEffect, useState } from 'react'
import { getStatus, uploadFile } from '../utils/opMiddleware'

export default function useOpMiddlewareApi() {
    const [isOpMiddlewareReady, setIsOpMiddlewareReady] = useState(false)
    const [opMiddlewareMessage, setOpMiddlewareMessage] = useState('')
    const [opMiddlewareError, setOpMiddlewareError] = useState('')

    useEffect(() => {
        async function initOpMiddlewareClient() {
            try {
                await getStatus()
                setIsOpMiddlewareReady(true)
                setOpMiddlewareMessage(`op-middleware ready`)
            } catch (error) {
                setOpMiddlewareError(
                    `op-middleware connection error: ${error.message}`
                )
            }
        }

        initOpMiddlewareClient()
    }, [])

    return {
        uploadFile,
        isOpMiddlewareReady,
        opMiddlewareMessage,
        opMiddlewareError
    }
}
