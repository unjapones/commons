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
