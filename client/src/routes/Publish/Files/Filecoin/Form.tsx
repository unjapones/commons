import React from 'react'
import Label from '../../../../components/atoms/Form/Label'
import Status from './Status'
import styles from '../Ipfs/Form.module.scss'

export default function Form({
    children,
    opMiddlewareMessage,
    opMiddlewareError,
    isOpMiddlewareReady,
    error
}: {
    children: any
    opMiddlewareMessage: string
    opMiddlewareError?: string
    isOpMiddlewareReady: boolean
    error?: string
}) {
    return (
        <div className={styles.ipfsForm}>
            <Label htmlFor="fileUpload" required>
                Add File To IPFS + Filecoin
            </Label>
            {children}
            <Status
                message={opMiddlewareMessage}
                isIpfsReady={isOpMiddlewareReady}
                error={opMiddlewareError || error}
            />
        </div>
    )
}
