// .env configuration
// Your API key goes in there))
require('dotenv').config();

process.env.NTBA_FIX_350 = 'true'; 

// Telegram bot setup
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

//URL regular expression
const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

// Requirements
const YTDlpWrap = require('yt-dlp-wrap').default;
const fs = require('fs');

// Installing binaries
YTDlpWrap.downloadFromGithub(
    './bin/binary'
);
const ytDlpWrap = new YTDlpWrap('./bin/binary');


// Bot message logic
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
  
    if (messageText === '/start') {
        
        bot.sendMessage(chatId, 'Send me video links!');
    
    } else if(urlRegex.test(messageText)){
        
        let id = messageText.substring(messageText.length-6, messageText.length);

        bot.sendMessage(chatId, 'Valid URL detected, processing now!');

        try{
            await downloadPipeline(messageText, id);

            await bot.sendVideo(chatId, `./videos/${id}.mp4`);
        
            bot.sendMessage(chatId, 'Finished!');
        
            deleteMedia(id);
        } catch {
            bot.sendMessage(chatId, 'Error, invalid URL.');
        }
            
    } else {
        
        bot.sendMessage(chatId, 'Error, invalid video URL.');
    
    }
  });

// Downloads from URL and names after id
async function downloadPipeline(url, id){
    let stdout = await ytDlpWrap.execPromise([
        url,
        '-f',
        'best',
        '-o',
        `./videos/${id}.mp4`,
    ]);
}

// Deletes video file with associated id
async function deleteMedia(id){
    try{
        fs.unlinkSync(`./videos/${id}.mp4`);
    } catch {
        console.log("Error deleting.")
    }
}
