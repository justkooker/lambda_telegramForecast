const { program } = require('commander');
const TelegramBot = require("node-telegram-bot-api");
const version = 'v1.0.0';
const config = require('config');
const TOKEN = config.get("token")
const bot = new TelegramBot(TOKEN, { polling: true });
const chatId = ''; //Тут має бути власний chatId, можна отримати командою @get_id_bot 

program
    .command('message')
    .arguments('text')
    .description('Send message to Telegram Bot')
    .action((message) => bot.sendMessage(chatId, message)
        .then(() => console.log('Message sent'))
        .then(() => process.exit())
        .catch((error) => console.log('Message submission error ', error)));
program
    .command('photo')
    .arguments('photo')
    .alias('p')
    .description('Send photo to Telegram Bot. Just drag and drop it console after p-flag.')
    .action((photo) => bot.sendPhoto(chatId, photo)
        .then(() => console.log("Photo sent"))
        .then(() => process.exit())
        .catch((error) => console.log('Photo submission error', error)));

program
    .version(version, 'version,-v')
    .description('version')
    .action(() => {
        console.log(version);
        process.exit();
    });

program.parse(process.argv);