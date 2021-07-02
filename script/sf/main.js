import puppeteer from 'puppeteer'
import writeData, {format as formatData} from '../tuya.trans.js'
import mainFormat from '../../lib/serve.js'
import {tuya} from '../../lib/env.js'

const loginPath = decodeURIComponent('https%3A%2F%2Flogin-cn.tuya-inc.com%3A7799%2FsfLogin')
const getApi = decodeURIComponent('https%3A%2F%2Fperformancemanager15.sapsf.cn%2Fodata%2Fv2%2Frestricted%2FTimeTypeBalance%2CUpcomingAbsences%2CTimeAccountBalanceOverview%2CEmployeeTime%2CAbsenceWorkflowInfo%2CTeamAbsenceCalendar%2FUpcomingAbsences')
const uri = `${getApi}?${encodeQuery({
    $skip: 0,
    $top: 366,
    $filter: `endDate ge '${today()}' and startDate le '${yearEnd()}'`
})}`
const dataName = 'tuya'

export default async function (username, password, token) {
    const browser = await puppeteer.launch({
        // headless: false,
        defaultViewport: null,
    })
    const page = await browser.newPage()
    // try {
    await login(page, { username, password, token })
    await getData(page)
    await browser.close()
    // } catch (e) {
    //     console.error(e)
    // }
}

const getData = async (page) => {
    const data = await page.evaluate((uri) => {
        return fetch(uri, {
            headers: {
                'accept': 'application/json',
                'x-ajax-token': window.ajaxSecKey
            }
        }).then((response) => {
            return response.json()
        }).then(data => {
            return data.d.results
        })
    }, uri)

    await Promise.allSettled([
        writeData(data),
        mainFormat(...tuya([
            [formatData(data), dataName],
        ]))
    ])
}

const login = async (page, { username = '', password = '', token = '' } = {}) => {
    const navigationPromise = page.waitForNavigation()

    await page.goto(loginPath)

    await page.waitForSelector('#login-form [name="username"]')
    await page.click('#login-form [name="username"]')
    await page.keyboard.type(username)

    await page.waitForSelector('#login-form [name="password"]')
    await page.click('#login-form [name="password"]')
    await page.keyboard.type(password)

    await page.waitForSelector('#login-form #dynamicPassword')
    await page.click('#login-form #dynamicPassword')
    await page.keyboard.type(token)

    await page.waitForSelector('#login-form #btn-commit')
    await page.click('#login-form #btn-commit')

    await page.waitForFunction('!!document.getElementById("login-warmmsg").textContent')

    const loginInfo = await page.evaluate(() => {
        return document.getElementById("login-warmmsg").textContent
    })

    if (!loginInfo.includes('成功')) {
        throw new Error(loginInfo)
    }

    await navigationPromise
    await navigationPromise
    await page.waitForSelector('#__tile16', {
        // 不超时，如果登录失败，则手动更新内容就好
        timeout: 0
    })
}

function encodeQuery(obj) {
    return Object.entries(obj).map(item => `${item[0]}=${encodeURIComponent(item[1])}`).join('&')
}

function today() {
    const date = new Date()

    return formatDate(date)
}

function yearEnd() {
    const date = new Date()
    date.setMonth(11)
    date.setDate(31)

    return formatDate(date)
}

/**
 * @param {Date} date 
 * @returns 
 */
function formatDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}-${(date.getDate() + '').padStart(2, '0')}`
}
