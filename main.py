import os, telebot
from bandi import Bandi
from datetime import datetime
BOT_TOKEN = os.environ.get('BOT_TOKEN')

bot = telebot.TeleBot(BOT_TOKEN)

bandi = Bandi()

@bot.message_handler(commands=['get'])
def getBando(message):
    idNum = None
    splitted = message.text.split(' ')
    if len(splitted) == 2:
        try:
            idNum = splitted[1]
        except:
            bot.reply_to(message, "Sintassi del comando non valida.\nUtilizza /get ID_BANDO<stringa>")
            return
    if not idNum:
        bot.reply_to(message, "Errore durante la ricerca del bando")
    else:
        info, docs, dettagli = bandi.getDettaglioBando(idNum)
        content = ""
        dettagli  = dettagli['payload']['altriBandi']
        content += dettagli['titoloRDO'] + "\n\n"
        content += "Committente: " + dettagli['enteCommittente'] + "\n\n"
        pubblicazione = dettagli['dataPubblicazione'] / 1000
        content += datetime.utcfromtimestamp(pubblicazione).strftime("%d-%m-%Y %H:%M:%S") + " - "
        scadenza = dettagli['dataScadenza'] / 1000
        content += datetime.utcfromtimestamp(scadenza).strftime("%d-%m-%Y %H:%M:%S") + "\n\n"
        info = info['payload']['dettaglioInformazioniRDO'][0]
        for d in info['dateIniziativa']:
            content += f"{d['titoloFase']}\n"
            data = d['data'] / 1000
            content += datetime.utcfromtimestamp(data).strftime("%d-%m-%Y %H:%M:%S") + "\n"
        bot.reply_to(message, content)
        for f in docs['payload']['listaDocumentiIniziativa']:
            filename = f"{f['idDocumento']}.{f['formato']}"
            output = bandi.getDocFile(f['idDocumento'], f['formato'])
            if output != -1:
                with open(filename, 'rb') as fdata:
                    bot.send_document(document=fdata, chat_id=message.chat.id)
                os.remove(filename)

@bot.message_handler(commands=['informatica'])
def send_elenco(message):
    limit = 10
    splitted = message.text.split(' ')
    if len(splitted) == 2:
        try:
            limit = int(splitted[1])
        except:
            bot.reply_to(message, "Sintassi del comando non valida.\nUtilizza /elenco N<intero>")
            return
    lista = bandi.getListaBandi('informatica')[0:limit]
    for i in lista:
        content = f"{i['titoloBando']}\n"
        for c in i['categoria']:
            content += f"({c})\n"
        content += f"ID: {i['idBando']}"
        bot.reply_to(message, content)

@bot.message_handler(commands=['servizipa'])
def send_elenco_pa(message):
    limit = 10
    splitted = message.text.split(' ')
    if len(splitted) == 2:
        try:
            limit = int(splitted[1])
        except:
            bot.reply_to(message, "Sintassi del comando non valida.\nUtilizza /elenco N<intero>")
            return
    lista = bandi.getListaBandi('servizipa')[0:limit]
    for i in lista:
        content = f"{i['titoloBando']}\n"
        for c in i['categoria']:
            content += f"({c})\n"
        content += f"ID: {i['idBando']}"
        bot.reply_to(message, content)
        
@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Ciao, benvenuto nel bot per i bandi MEPA, come posso aiutarti ?\nUsa /elenco N per ottenere N risultati dalla ricerca bandi.\nUsa /get ID per ottenere le informazioni dettagliate di un bando.")


bot.infinity_polling()
bot.set_webhook("https://mepa-bot-web-service.onrender.com/bot" + BOT_TOKEN)
bot.run_webhooks("https://mepa-bot-web-service.onrender.com/bot" + BOT_TOKEN)