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
