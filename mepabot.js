const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://mepa-bot-web-service.onrender.com';
const bot = new Telegraf(BOT_TOKEN);

bot.command("up", async context => {
    context.reply("Bot is up");
});

async function run() {
    
    if (process.env.LOCAL){
        bot.launch();
        console.log(`Launch local with token: ${BOT_TOKEN}`)
    }
    else {
        console.log(`Setting webhook to ${URL}/bot${BOT_TOKEN}`)
        bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
        bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT)
        console.log(`Start hook on :${PORT} with token: ${BOT_TOKEN}`)
    }
}
run().catch(console.dir);