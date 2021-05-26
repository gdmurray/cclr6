export function findWithAttr(array: any[], attr: string, value: any): number[] {
    let idx = []
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
    'CA': 'CA',
    'USA': 'US'
}