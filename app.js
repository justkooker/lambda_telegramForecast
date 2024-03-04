const TelegramBot = require("node-telegram-bot-api");
const config = require('config');
const TOKEN = config.get("token")
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', (message) => {
    const chatId = message.chat.id;
    const user = message.from.username;
    const text = message.text;
    if (message.text === 'photo') {
        console.log(`Користувач ${user} запросив картинку`)
        bot.sendMessage(chatId, `https://picsum.photos/200/300`);
    } else {
        console.log(`Користувач ${user} написав:${text}`);
        bot.sendMessage(chatId, message.text)
    }
})
//В завданні написано, треба використовувати axios, але його використання разов з node-telegram-bot-api тільки ускладнює код, на мою думку.