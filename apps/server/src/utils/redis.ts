export const getMagicLinkKey = (email: string) => {
    return `link:${email}`
}

export const getSessionKey = (token: string) => {
    return `session:${token}`
}