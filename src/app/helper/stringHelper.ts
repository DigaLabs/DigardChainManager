/* eslint-disable no-useless-escape */
export const stringHelper = {
  checkSpecialCharacter: (val: string): boolean => {
    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

    return regex.test(val)
  },
  checkAnyLowerCase: (val: string): boolean => {
    return val
      .split('')
      .some((c) => c.toLowerCase() === c && isNaN(+c) && !stringHelper.checkSpecialCharacter(c))
  },

  checkAnyUpperCase: (val: string): boolean => {
    return val
      .split('')
      .some((c) => c.toUpperCase() === c && isNaN(+c) && !stringHelper.checkSpecialCharacter(c))
  },
  checkAnyNumber: (val: string): boolean => {
    return val.split('').some((c) => !isNaN(+c))
  },
  convertToShortenedAddr: (val: string, firstCharLength = 4): string => {
    if (!val) return ''

    const first2 = val.substring(0, firstCharLength)
    const lastCharacter = firstCharLength - 1
    const last4 = val.slice(val.length - lastCharacter, val.length)

    return `${first2}...${last4}`
  },
  convertToX: (value: string): string => {
    return value.toLowerCase()
  },

  formatString: (value: any): string => {
    if (Array.isArray(value)) {
      value = value.join(', ')
    } else if (typeof value !== 'string') {
      value = String(value)
    }
    if (value.length > 90) {
      return `${value.substring(0, 87)}...`
    }

    return value
  },
}
