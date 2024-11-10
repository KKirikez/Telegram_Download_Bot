// .env configuration
// Your API key goes in there))
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

//URL regular expression
const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

const YTDlpWrap = require('yt-dlp-wrap').default;
const fs = require('fs');

YTDlpWrap.downloadFromGithub(
    './bin/binary'
);

const ytDlpWrap = new YTDlpWrap('./bin/binary');


// Bot message logic
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
  
    if (messageText === '/start') {
      bot.sendMessage(chatId, 'Send me video links!');
    } else if(urlRegex.test(messageText)){
        bot.sendMessage(chatId, 'Valid URL detected, processing now!');
        
        downloadPipeline(messageText);
        
        bot.sendVideo(chatId, './videos/output.mp4');
        
        bot.sendMessage(chatId, 'Finished!');
        
        deleteMedia(url);
    } else {
        bot.sendMessage(chatId, 'Error, invalid video URL.');
    }
  });

async function downloadPipeline(url){
    let metadata = await ytDlpWrap.getVideoInfo(
        url
    );
    let stdout = await ytDlpWrap.execPromise([
        url,
        '-f',
        'best',
        '-o',
        `./videos/${metadata.title}.mp4`,
    ]);
    
}

async function deleteMedia(url){
    fs.unlink(`./videos/${url}.mp4`)
}
