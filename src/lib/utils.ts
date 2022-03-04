import { ColumnType } from 'antd/es/table/interface'

export function findWithAttr(array: any[], attr: string, value: any): number[] {
    const idx = []
    try {
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                idx.push(i)
            }
        }
    } catch (err) {
        console.log('error finding attribute: ', array, attr, value)
    }

    return idx
}

export const countryMapping = {
    CA: 'CA',
    USA: 'US',
}

export const getQueryKeyMap = (docs: any[]): { id: Record<any, any> } => {
    return docs.reduce((acc, doc) => {
        acc[doc.id] = {
            id: doc.id,
            ...doc.data(),
        }
        return acc
    }, {})
}

export function getExpires(hours: number): string {
    const now = new Date()
    now.setHours(now.getHours() + hours)
    return now.toISOString()
}

export const LINE_EXPRESSION = /\r\n|\n\r|\n|\r/g

export function getHostName(): string {
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3001'
    }
    return 'https://cclr6.com'
}

export const isPlayerEqual = (updatedPlayer, originalPlayer): boolean => {
    const fields = ['country', 'email', 'id', 'is_captain', 'uplay', 'twitter', 'twitch']
    return !fields.some((field) => updatedPlayer[field] != originalPlayer[field])
}

export function makeId(length: number): string {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

export function omit<T>(obj, omitKey): Partial<T> {
    return Object.keys(obj).reduce((result, key) => {
        if (key !== omitKey) {
            result[key] = obj[key]
        }
        return result
    }, {})
}

export function uniqueFilters<T>(data: T[], reducer: (() => string) | string) {
    const uniqueMap = typeof reducer === 'function' ? data.map(reducer) : data.map((elem) => elem[reducer])
    return [...new Set(uniqueMap)].map((elem) => ({
        value: elem,
        text: elem,
    }))
}

export function createFilters<T>(
    data,
    accessor: (() => string) | string,
    additionalOptions: Partial<ColumnType<T>> = {}
): Partial<ColumnType<T>> {
    const onFilter =
        typeof accessor === 'function'
            ? (value, record) => [record].map(accessor).pop() === value
            : (value, record) => record[accessor] === value
    return {
        filters: uniqueFilters<T>(data, accessor),
        onFilter: onFilter,
        ...additionalOptions,
    }
}
