import requests, base64
proxies = {
   'http': 'http://127.0.0.1:8080',
   'https': 'https://127.0.0.1:8080',
}
class Bandi():
    def __init__(self):
      self.listaBandiEndpoint = "https://www.acquistinretepa.it/publicservices/vetrineservices/getAltriBandiRdoAperte"
      self.sess = requests.Session()
    def getListaBandi(self):
        filters = {"isArchive":False,"strumento":[{"label":"RDO APERTE","totale":18,"id":15}],"stato":[],"categoria":[{"label":"Informatica, elettronica, telecomunicazioni e macchine per l'ufficio","totale":48,"id":"2325bc4a2168634e"},{"label":"Servizi per il Funzionamento delle P.A.","totale":0,"id":"ccc667905df1eab6"}],"mostra":"","idt":"","dataPubblicazione":None,"tempo":{"dataDa":"","dataA":""},"paginazione":{"pagina":1,"itemPagina":999},"orderBy":{"campo":"dataPubblicazione","verso":"desc"}}
        result = self.sess.post(self.listaBandiEndpoint, json=filters)
        if result.status_code == 200:
            return result.json()['payload']['elencoBandi']
        return None
    def getDettaglioBando(self, idbando):
        dettaglioBando = "https://www.acquistinretepa.it/publicservices/iniziativaservices/getDettaglioBandoRDO"
        dettaglioInformazioni = "https://www.acquistinretepa.it/publicservices/iniziativaservices/getDettaglioInformazioniRDO"
        docsIniziativa = "https://www.acquistinretepa.it/publicservices/iniziativaservices/getDocIniziativa"
        filters = {"idIniziativa":idbando}
        info = self.sess.post(dettaglioInformazioni, json=filters)
        dettagli = self.sess.post(dettaglioBando, json=filters)
        docs = self.sess.post(docsIniziativa, json=filters)
        return [info.json(), docs.json(), dettagli.json()]
    def getDocFile(self, iddocumento, formato):
        docsEndpoint = "https://www.acquistinretepa.it/eproc2/documentaleservices/getDocumento"
        filters = {"idDocumento":iddocumento}
        getcookies = self.sess.post(docsEndpoint, json=filters)
        getcookies = getcookies.cookies
        file = self.sess.post(docsEndpoint, json=filters, cookies=getcookies)
        data = file.json()['payload']['file']
        binary_data = base64.b64decode(data)
        try:
            with open(f'{iddocumento}.{formato}', 'wb') as f:
                f.write(binary_data)
            return 1
        except:
            return -1        

