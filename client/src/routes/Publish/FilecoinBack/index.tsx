import React from 'react'
import shortid from 'shortid'
import useFilecoinBacking from '../../../hooks/use-filecoin-backing'
import Help from '../../../components/atoms/Form/Help'
import Item from './Item'
import styles from './index.module.scss'

export default function QueueFilecoinBack({
    files
}: {
    files: { url: string }[]
}) {
    const { ipfsFolders } = useFilecoinBacking(files)

    const urls = Object.keys(ipfsFolders)
    const ipfsFiles = urls.map((url: string) => {
        return {
            url,
            status: ipfsFolders[url].status as string,
            lastUpdate: ipfsFolders[url].lastUpdate as Date
        }
    })

    return (
        <>
            <Help>
                Files added to IPFS will be backed in Filecoin network. This job
                is asynchronous and helps Commons to have a backup of the files
                (you don&apos;t need to do anything and can continue browsing or
                publishing data assets).
            </Help>

            <div className={styles.filecoinItems}>
                <ul className={styles.itemsList}>
                    {ipfsFiles.map((item) => (
                        <Item key={shortid.generate()} item={item} />
                    ))}
                </ul>
            </div>
        </>
    )
}
