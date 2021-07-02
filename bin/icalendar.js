import main from '../lib/main.js'

let name = process.argv.slice(2)
main(name && name[0])
