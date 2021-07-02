import serve from './serve.js'
import env from './envData.js'

const main = async (name) => {
    if (!name)
        throw new Error('无效参数')

    if (name == 'all') {
        await Promise.allSettled(Object.values(env).map((item) => {
            return serve(...item)
        }))
    } else {
        await serve(...env[name])
    }
}

export default main
