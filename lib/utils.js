import md5 from 'md5'
let uid = Date.now()

export function getUid (key) {
    return md5(key || uid++)
}