import program from 'commander'
import main from './main.js'

program
    .description('提供账号名、密码、口令，获取今年数据')
    .arguments('[username] [password] [token]')
    .action((username, password, token) => {
        if (!username) {
            /* eslint-disable-next-line no-console */
            console.error('👻请提供账号名！')
            process.exit(1)
        }
        if (!password) {
            /* eslint-disable-next-line no-console */
            console.error('👻请提供密码！')
            process.exit(1)
        }
        if (!token) {
            /* eslint-disable-next-line no-console */
            console.error('👻请提供口令！')
            process.exit(1)
        }

        main(username, password, token)
    })

program.parse(process.argv)

