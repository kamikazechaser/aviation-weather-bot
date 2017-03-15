const request = require('request');
const cheerio = require('cheerio');
const telegramBot = require('node-telegram-bot-api');

const telegramToken = '356806264:AAGAC4f0V4ia9Z7AuVexoZgsV_9brMVlJb4';

const bot = new telegramBot(telegramToken, {
    polling: true,
});

function getWeather(location, callback) {
    const url = `https://www.aviationweather.gov/metar/data?ids=${location}&format=decoded&date=0&hours=0`;
    request(url, (error, response, html) => {
        const $ = cheerio.load(html);
        let data = {};
        data.metar = $('td').eq(5).text();
        data.text = $('td').eq(7).text();
        data.temperature = $('td').eq(9).text();
        data.dewpoint = $('td').eq(11).text();
        data.pressure = $('td').eq(13).text();
        data.winds = $('td').eq(15).text();
        data.visibility = $('td').eq(17).text();
        data.ceiling = $('td').eq(19).text();
        data.clouds = $('td').eq(21).text();
        callback(data)
    });
}

bot.onText(/\/get (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    getWeather(resp, ctx => {
        bot.sendMessage(chatId, `<b>METAR for:</b> ${ctx.metar}\n<b>Text:</b> ${ctx.text}\n<b>Temperature:</b> ${ctx.temperature}\n<b>Dewpoint:</b> ${ctx.dewpoint}\n<b>Pressure (altimeter):</b> ${ctx.pressure}\n<b>Winds:</b> ${ctx.winds}\n<b>Visibilty:</b> ${ctx.visibility}\n<b>Ceiling:</b> ${ctx.ceiling}\n<b>Clouds:</b> ${ctx.clouds}\n`, {
            parse_mode: 'HTML'
        });
    });
});

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Usage: /get [code]')
});