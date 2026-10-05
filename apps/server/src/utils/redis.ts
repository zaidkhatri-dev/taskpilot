export const getMagicLinkKey = (token: string) => {
    return `magic:${token}`
}

export const getCounterKey = (email: string) => {
    return `counter:${email}`
}

export const getSessionKey = (token: string) => {
    return `session:${token}`
}