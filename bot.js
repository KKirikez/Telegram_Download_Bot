// .env configuration
// Your API key goes in there))
import dotenv from 'dotenv';
dotenv.config();


import TelegramBot from 'node-telegram-bot-api';

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

//looks for URLs
const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?$/;


// Bot message logic
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
  
    if (messageText === '/start') {
      bot.sendMessage(chatId, 'Send me video links!');
    } else if(urlRegex.test(messageText)){
        bot.sendMessage(chatId, 'Valid URL')
    } else {
        bot.sendMessage(chatId, 'Error, invalid video URL');
    }
  });

function downloadPipeline(url){
    
}

