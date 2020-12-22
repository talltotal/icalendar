import serve from './serve.js'
import env from './env.js'

let data = process.argv.slice(2)
data = data && data[0]
if (data == 'all') {
    Object.values(env).forEach((item) => {
        serve(...item)
    })

    process.exit(0)
}

data = data && env[data]

if (!data)
    throw new Error('无效参数')

serve(...data)
