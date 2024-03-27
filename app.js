const TelegramBot = require("node-telegram-bot-api");
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');
const config = require('config');
const TOKEN = config.get("token");
const weatherApiKey = config.get('weatherApiKey');
const bot = new TelegramBot(TOKEN, { polling: true });
const cities = [{ btnText: 'Weather forecast in Dnipro', city: 'Dnipro' }];
const baseUrl = `http://api.openweathermap.org/data/2.5/forecast?appid=${weatherApiKey}&units=metric`;
const frequencies = [
    {
        text: 'Every 3 hours',
        num: 3
    },
    {
        text: 'Every 6 hours',
        num: 6
    }
]
let forecast;
let chosenCity;


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const message = 'Hi, choose your city';

    const keyboard = {
        reply_markup: {
            keyboard:
                cities.map(el => [{ text: el.btnText }]),
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    };
    bot.sendMessage(chatId, message, keyboard);
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const msgText = msg.text;
    const city = cities.find(city => city.btnText === msgText);
    const frequency = frequencies.find(frequency => frequency.text === msgText);
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    if (city) {
        chosenCity = city.city;
        const keyboard = {
            reply_markup: {
                keyboard: frequencies.map(el => [{ text: el.text }]),
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        };
        bot.sendMessage(chatId, 'Choose the update frequency:', keyboard);
    }
    if (frequency) {
        forecast = await axios(`${baseUrl}&q=${chosenCity}`).then(res => res.data.list).catch(error => console.log(error));
        const filteredForecast = forecast.filter(el => +(el.dt_txt.split(' ')[1].split(':')[0]) % frequency.num === 0
            || +(el.dt_txt.split(' ')[1].split(':')[0]) === 0);
        let prevDay;
        let forecastMarkup = filteredForecast.reduce((acc, el) => {
            const date = new Date(el.dt * 1000);
            let isNewDay = true;
            if (prevDay?.getDay() === date.getDay()) {
                isNewDay = false;
            } else {
                isNewDay = true;
            }
            let weekDay = date.getDay();
            let day = date.getDate();
            let month = months[date.getMonth()];
            let time = el.dt_txt.split(' ')[1].split(':').slice(0, 2).join(':');
            let degree = Math.floor(el.main.temp);
            let feels = Math.floor(el.main.feels_like);
            let weather = el.weather[0].main;
            let line = `${isNewDay ? ` \n ${weekDays[weekDay]}, ${day} ${month} \n` : ``} ${time} ${degree}°C, feels like: ${feels}°C, ${weather}\n`;
            prevDay = date;
            return acc + line;
        }, `Weather forecast for 5 days: \n`);
        bot.sendMessage(chatId, forecastMarkup);
    }
})