import fs from 'fs'
import data from './tuya.2021.data.js'


const iDate = []
/**
 * type 类型有：
 * - NON_WORKING_DAY
 * - HOLIDAY
 */
let startDay = null
let endDay = null
let dayType = null
let dayName = null
data.forEach(({ startDate, endDate, type, externalName }) => {
    // 同一天的情况，HOLIDAY优先级更高
    if (endDay == startDate && type != 'HOLIDAY') {
        return
    }

    if (dayType === type && endDay) {
        const lastEndDate = new Date(endDay)
        lastEndDate.setHours(0)
        lastEndDate.setMinutes(0)
        lastEndDate.setSeconds(0)
        lastEndDate.setMilliseconds(0)
        lastEndDate.setDate(lastEndDate.getDate() + 1)
        const thisStartDate = new Date(startDate)
        thisStartDate.setHours(0)
        thisStartDate.setMinutes(0)
        thisStartDate.setSeconds(0)
        thisStartDate.setMilliseconds(0)
        // 连续相同的类型的日期
        if (thisStartDate.getTime() === lastEndDate.getTime()) {
            endDay = endDate
            return
        }
    }

    // 将缓存入队并重置缓存
    if (startDay) {
        iDate.push({
            name: dayType === 'HOLIDAY' ? `${dayName}` : '非工作日',
            vacation: [formatDateToI(startDay), formatDateToI(endDay)],
        })
    }

    startDay = startDate
    endDay = endDate
    dayType = type
    dayName = externalName
})

function formatDateToI (day) {
    const date = new Date(day)
    return `${date.getFullYear()}.${(date.getMonth() + 1 + '').padStart(2, '0')}.${(date.getDate() + '').padStart(2, '0')}`
}

fs.writeFile('./data/tuya.js', `export default ${JSON.stringify(iDate, null, 4)}`, (e) => {
    console.error(e)
})