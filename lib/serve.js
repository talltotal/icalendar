import creator, { createdUID, getStamp } from './creator.js'
import fs from 'fs'
import path from 'path'

function formatDay(str) {
    return (str + '').replace(/[^0-9]/g, '')
}

async function checkPreData (dataList = [], target) {
    function sameProperty(obj1, obj2, propertys = []) {
        return propertys.every(key => obj1[key] === obj2[key])
    }

    try {
        const {default: preData} = await import(`../data/cache_${target}.js`)
        const preMap = new Map()
        preData.forEach(item => {
            preMap.set(item.UID, item)
        })
        dataList.forEach((item) => {
            if (preMap.has(item.UID)) {
                const preItem = preMap.get(item.UID)
                if (sameProperty(item, preItem, ['name', 'class', 'start', 'end'])) {
                    item.time = preItem.time
                }
            }
        })
    } catch (err) {
        // console.error(err)
    }
}

async function main (dData, target, dName) {
    const days = dData
    const stamp = getStamp()

    const dayData = days.flatMap(([lists, key]) => {
        return lists.flatMap(item => {
            return [
                ...(item.vacation ? [{
                    UID: createdUID(key + item.name + JSON.stringify(item.vacation)),
                    name: item.name + '·休',
                    class: 'PUBLIC',
                    start: formatDay(item.vacation[0]),
                    end: +formatDay(item.vacation[1]) + 1 + '',
                    time: stamp,
                }] : []),
                ...(item.work && !!item.work.length ? item.work.map(work => {
                    return {
                        UID: createdUID(key + item.name + JSON.stringify(work)),
                        name: item.name + '·班',
                        class: 'PUBLIC',
                        start: formatDay(work),
                        end: +formatDay(work) + 1 + '',
                        time: stamp,
                    }
                }) : [])
            ]
        })
    })
    
    await checkPreData(dayData, target)
    
    const ics = creator({
        calName: dName,
    }, dayData)
    
    fs.writeFile(path.resolve(process.cwd(), `./data/cache_${target}.js`), 'export default ' + JSON.stringify(dayData, null, 4), () => {})
    fs.writeFile(path.resolve(process.cwd(), `./data/${target}.ics`), ics, () => {})
}

export default main
