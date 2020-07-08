import axios from 'axios'

import { opMiddlewareUri } from '../config'

export async function getStatus() {
    try {
        const r = await axios.get(`${opMiddlewareUri}/status`)
        return r.data
    } catch (err) {
        throw new Error(err.message)
    }
}

export async function uploadFile(
    file: any,
    onUploadProgress: (pe: ProgressEvent) => unknown
) {
    try {
        const formData = new FormData()
        formData.append('file', file)
        const r = await axios.post(`${opMiddlewareUri}/storage`, formData, {
            onUploadProgress
        })
        return r.data
    } catch (err) {
        throw new Error(err.message)
    }
}

export async function queueBack(
    urls: string[]
): Promise<{ url: string; jobId: string; status: string; detail: any }[]> {
    try {
        const r = await axios.post(`${opMiddlewareUri}/ipfs`, urls)
        return r.data
    } catch (err) {
        throw new Error(err.message)
    }
}

export async function getJobStatuses(jobIds: string[]) {
    try {
        const r = await axios.post(
            `${opMiddlewareUri}/ipfs/jobsstatusarray`,
            jobIds
        )
        return r.data
    } catch (err) {
        throw new Error(err.message)
    }
}

export function pollJobStatuses(
    jobIds: string[],
    onUpdate: (data: any) => void,
    intervalTime: number
) {
    const clean = setInterval(async () => {
        const response = await getJobStatuses(jobIds)
        onUpdate(response)
    }, intervalTime)
    return clean
}
