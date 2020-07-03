import axios from 'axios'
import { Logger } from '@oceanprotocol/squid'

export function formatBytes(a: number, b: number) {
    if (a === 0) return '0 Bytes'
    const c = 1024
    const d = b || 2
    const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const f = Math.floor(Math.log(a) / Math.log(c))

    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

export function arraySum(array: number[]) {
    return array.reduce((a, b) => a + b, 0)
}

export async function streamFiles(
    ipfs: any,
    file: any
): Promise<string | undefined> {
    const additions = ipfs.add(file, { wrapWithDirectory: true })
    for await (const addRes of additions) {
        // Two things will be added, return the wrapping directory's CID
        if (addRes.path !== file.path) {
            return addRes.cid
        }
    }
}

export async function pingUrl(url: string) {
    try {
        const response = await axios(url)
        if (response.status !== 200) Logger.error(`Not found: ${url}`)

        Logger.log(`File found: ${url}`)
        return true
    } catch (error) {
        Logger.error(error.message)
    }
    return false
}

export function readFileAsync(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => {
            reader.abort()
            reject(new DOMException('Problem parsing input file.'))
        }
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.readAsArrayBuffer(file)
    })
}
export function readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => {
            reader.abort()
            reject(new DOMException('Problem parsing input file.'))
        }
        reader.onload = () => {
            resolve(reader.result as string)
        }
        reader.readAsText(file)
    })
}
