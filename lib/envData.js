import d2021 from '../data/2021.js'
// import dngmm from '../data/ngmm.js'
import dtuya from '../data/tuya.js'

import {vacation, ngmm, tuya} from './env.js'

export default {
    vacation: vacation([
        [d2021, 2021]
    ]),
    // ngmm: [
    //     [
    //         [dngmm, 'ngmm'],
    //         [d2021, 2021],
    //     ],
    //     'ngmm',
    //     'ngmm-节假日'
    // ],
    tuya: tuya([
        [dtuya, 'tuya'],
    ])
}
