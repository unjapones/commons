import { useEffect, useState } from 'react'
import { queueBack, pollJobStatuses } from '../utils/opMiddleware'

export const finishedJobStatuses = ['SUCCESS', 'FAILED', 'CANCELLED']
const pollingIntervalMillis = 2500

type IpfsFolders = {
    [key: string]: {
        jobId?: string
        status?: string
        lastUpdate?: Date
    }
}

export default function useFilecoinBacking(files: { url: string }[]) {
    const [isFilecoinBackWorking, setIsFilecoinBackWorking] = useState(false)
    const [isPollingWorking, setIsPollingWorking] = useState(false)
    const [ipfsFolders, setIpfsFolders] = useState<IpfsFolders>({})

    useEffect(() => {
        async function queueFilecoinBackByUrl(iFolders: IpfsFolders) {
            try {
                const urls = Object.keys(iFolders)
                if (urls.length === 0) return

                const newIpfsFolders = { ...ipfsFolders }
                const queueItemsArray = await queueBack(urls)
                queueItemsArray.forEach((item) => {
                    newIpfsFolders[item.url] = {
                        jobId: item.jobId,
                        status: item.status,
                        lastUpdate: new Date()
                    }
                })
                setIpfsFolders(newIpfsFolders)
            } catch (err) {
                console.warn(err)
                setIsFilecoinBackWorking(false)
            }
        }
        const iFolders = {} as IpfsFolders
        files
            .filter((file) => file.url.indexOf('ipfs://') === 0)
            .forEach((file) => (iFolders[file.url] = {}))
        if (
            Object.keys(iFolders).length > 0 &&
            Object.keys(ipfsFolders).length === 0
        ) {
            setIsFilecoinBackWorking(true)
            queueFilecoinBackByUrl(iFolders)
        }
    }, [files, ipfsFolders])

    useEffect(() => {
        const jobIds = Object.values(ipfsFolders)
            .filter((jobInfo) => jobInfo.jobId)
            .map((jobInfo) => jobInfo.jobId)
        if (jobIds.length === 0 || isPollingWorking) {
            return
        }

        setIsPollingWorking(true)
        const cleanPoll = pollJobStatuses(
            jobIds as string[],
            (response: { url: string; status: string }[]) => {
                const newIpfsFolders = { ...ipfsFolders }
                // Count finished jobs and update state at the same time
                const finishedJobsCount = response.reduce(
                    (count, ri: { url: string; status: string }) => {
                        const { url, status } = ri
                        newIpfsFolders[url] = {
                            ...ipfsFolders[url],
                            lastUpdate: new Date(),
                            status
                        }
                        return finishedJobStatuses.indexOf(status) > -1
                            ? count + 1
                            : count
                    },
                    0
                )
                setIpfsFolders(newIpfsFolders)
                // Finish polling when all jobs finshed
                // @TODO: use timeout to force cancelling in worst case scenario
                if (finishedJobsCount === jobIds.length) {
                    clearInterval(cleanPoll)
                    setIsPollingWorking(false)
                    setIsFilecoinBackWorking(false)
                }
            },
            pollingIntervalMillis
        )
    }, [ipfsFolders])

    return {
        isFilecoinBackWorking,
        isPollingWorking,
        ipfsFolders
    }
}
