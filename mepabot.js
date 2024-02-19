const { Telegraf } = require('telegraf');
const { getListaBandi, getDettaglioBando, getDocsList, getDocFile } = require("./bandi");
const dotenv = require('dotenv');
const dayjs = require("dayjs");
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://mepa-bot-web-service.onrender.com';
const bot = new Telegraf(BOT_TOKEN);

bot.command("up", async context => {
    context.reply("Bot is up");
});

bot.command("informatica", async context => {
    const textmessage = context.message.text;
    const splitted = textmessage.split(" ");
    if (splitted.length != 2) {
        context.reply("Sintassi del comando errata...");
    }
    else {
        let limit = parseInt(splitted[1]);
        if (isNaN(limit)) {
            context.reply("Sintassi del comando errata...");
        }
        else {
            const list = await getListaBandi("informatica", limit);
            list.forEach(bando => {
                let content = bando.titoloBando + "\n";
                bando.categoria.forEach(categoria => {
                    content += categoria + "\n";
                });
                content += "ID: " + bando.idBando;
                let markup = [
                    [
                        {
                            text: "Visualizza dettagli",
                            callback_data: `getinfo-${bando.idBando}`
                        }
                    ],
                    [
                        {
                            text: "Ottieni documenti",
                            callback_data: `getdocs-${bando.idBando}`
                        }
                    ]
                ];
                context.reply(content, { reply_markup: { inline_keyboard: markup }});
            });
        }
    }
});

bot.command("servizipa", async context => {
    const textmessage = context.message.text;
    const splitted = textmessage.split(" ");
    if (splitted.length != 2) {
        context.reply("Sintassi del comando errata...");
    }
    else {
        let limit = parseInt(splitted[1]);
        if (isNaN(limit)) {
            context.reply("Sintassi del comando errata...");
        }
        else {
            const list = await getListaBandi("servizipa", limit);
            list.forEach(bando => {
                let content = bando.titoloBando + "\n";
                bando.categoria.forEach(categoria => {
                    content += categoria + "\n";
                });
                content += "ID: " + bando.idBando;
                let markup = [
                    [
                        {
                            text: "Visualizza dettagli",
                            callback_data: `getinfo-${bando.idBando}`
                        }
                    ],
                    [
                        {
                            text: "Ottieni documenti",
                            callback_data:  `getdocs-${bando.idBando}`
                        }
                    ]
                ];
                context.reply(content, { reply_markup: { inline_keyboard: markup }});
            });
        }
    }
});

bot.action(new RegExp("getinfo-(.*)"), async context => {
    var query = context.update.callback_query.data.replace('getinfo-', '').split('-');
    var bandoId = query[0];
    const bando = await getDettaglioBando(bandoId);
    if (!bando) {
        context.reply("Si è verificato un errore");
    }
    else {
        let info = bando[0];
        let dettagli = bando[1];
        let content = "";
        dettagli = dettagli.payload.altriBandi;
        content += dettagli.titoloRDO + "\n\n";
        content += "Committente: " + dettagli.enteCommittente + "\n\n";
        let pubblicazione = dayjs(dettagli.dataPubblicazione).format("'DD/MM/YYYY'");
        content += pubblicazione + " - ";
        let scadenza = dayjs(dettagli.dataScadenza).format("'DD/MM/YYYY'");
        content += scadenza + "\n";
        info = info.payload.dettaglioInformazioniRDO[0];
        info.dateIniziativa.forEach(data => {
            content += dayjs(data.data).format("DD/MM/YYYY HH:mm") + " - ";
            content += data.titoloFase + "\n";
        })
        context.reply(content);    
    }
});

bot.action(new RegExp("getdocs-(.*)"), async context => {
    /*
    var query = context.update.callback_query.data.replace('getdocs-', '').split('-');
    var bandoId = query[0];
    const docsList = await getDocsList(bandoId);
    context.reply("Lista documenti per bando: " + bandoId);
    docsList.payload.listaDocumentiIniziativa.forEach(async doc => {
        let filename = `${doc.idDocumento}.${doc.formato}`;
        let a = await getDocFile(doc.idDocumento, doc.formato);
    });
    */
   context.reply("[Ottieni documenti] Funzionalità ancora in fase di sviluppo...");
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