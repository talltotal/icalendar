/**
 * @file icalendar 生成器
 * - [ics规范](https://icalendar.org/RFC-Specifications/iCalendar-RFC-7986/)
 */
import {getUid} from './utils.js'

export default function createCalendar ({ calName, color }, dataList = []) {    
    return [
        'BEGIN:VCALENDAR',

        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        `X-WR-CALNAME:${calName}`,
        ...(color ? [`X-APPLE-CALENDAR-COLOR:${color}`] : []),

        ...(dataList.map(item => {
            return createEvent(item)
        })),

        `END:VCALENDAR`
    ].join('\n')
}

/**
 * 
 * @param {{
 * UID: string,
 * name: string,
 * class?: string,
 * start: string,
 * end: string,
 * }} item 
 */
function createEvent (item) {
    return [
        'BEGIN:VEVENT',

        `DTSTAMP:${item.time}`,

        `DTSTART;VALUE=DATE:${item.start}`,
        `DTEND;VALUE=DATE:${item.end}`,

        `SUMMARY:${item.name}`,
        `UID:${item.UID}`,
        ...(item.class ? [`CLASS:${item.class}`] : []),

        'END:VEVENT'
    ].join('\n')
}

/**
 * @returns {String}
 */
export function createdUID (key) {
    return getUid(key).replace(
        /([0-9a-z]{8})([0-9a-z]{4})([0-9a-z]{4})([0-9a-z]{4})([0-9a-z]+)/,
        '$1-$2-$3-$4-$5')
}

/**
 * @param {Date} date 
 * @returns {String}
 */
export function getStamp (date) {
    function format (str, len) {
        return (str + '').padStart(len, '0')
    }
    /** @type Date */
    const time = date || new Date()
    const yyyy = time.getUTCFullYear()
    const MM = format(time.getUTCMonth() + 1, 2)
    const dd = format(time.getUTCDate(), 2)
    const hh = format(time.getUTCHours(), 2)
    const mm = format(time.getUTCMinutes(), 2)
    const ss = format(time.getUTCSeconds(), 2)

    return `${yyyy}${MM}${dd}T${hh}${mm}${ss}Z`
}

