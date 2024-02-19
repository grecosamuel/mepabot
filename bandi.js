const dettaglioBando = "https://www.acquistinretepa.it/publicservices/iniziativaservices/getDettaglioBandoRDO";
const dettaglioInformazioni = "https://www.acquistinretepa.it/publicservices/iniziativaservices/getDettaglioInformazioniRDO";
const docsIniziativa = "https://www.acquistinretepa.it/publicservices/iniziativaservices/getDocIniziativa";
const docsEndpoint = "https://www.acquistinretepa.it/eproc2/documentaleservices/getDocumento";

async function getListaBandi(categoria, limit=999){
    let endpoint = "https://www.acquistinretepa.it/publicservices/vetrineservices/getAltriBandiRdoAperte";
    let filters = {};
    if (categoria == 'informatica') {
        filters = {"isArchive":false,"strumento":[{"label":"RDO APERTE","totale":18,"id":15}],"stato":[],"categoria":[{"label":"Informatica, elettronica, telecomunicazioni e macchine per l'ufficio","totale":48,"id":"2325bc4a2168634e"}],"mostra":"","idt":"","dataPubblicazione":null,"tempo":{"dataDa":"","dataA":""},"paginazione":{"pagina":1,"itemPagina":limit},"orderBy":{"campo":"dataPubblicazione","verso":"desc"}}
    }
    else {
        filters = {"isArchive":false,"strumento":[{"label":"RDO APERTE","totale":18,"id":15}],"stato":[],"categoria":[{"label":"Servizi per il Funzionamento delle P.A.","totale":0,"id":"ccc667905df1eab6"}],"mostra":"","idt":"","dataPubblicazione":null,"tempo":{"dataDa":"","dataA":""},"paginazione":{"pagina":1,"itemPagina":limit},"orderBy":{"campo":"dataPubblicazione","verso":"desc"}}
    }
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        });

        if (response.ok) {
            const data = await response.json();
            return data.payload.elencoBandi;
        } else {
            throw new Error('Errore durante la richiesta dei dati');
        }
    } catch (error) {
        throw new Error('Errore durante la richiesta HTTP: ' + error.message);
    }
};

async function getDettaglioBando(idBando) {
    const filters = {"idIniziativa" : idBando};
    let result = [];
    try {        
        const responseInformazioni = await fetch(dettaglioInformazioni, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        });

        if (responseInformazioni.ok) {
            const data = await responseInformazioni.json();
            result.push(data);
        } else {
            throw new Error('Errore durante la richiesta dei dati');
        }

        const responseBando = await fetch(dettaglioBando, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        });

        if (responseBando.ok) {
            const data = await responseBando.json();
            result.push(data);
        } else {
            throw new Error('Errore durante la richiesta dei dati');
        }

        if (result.length == 2) return result;
        else return null;
    } catch (error) {
        throw new Error('Errore durante la richiesta HTTP: ' + error.message);
    }
    

};

async function getDocsList(idBando) {
    const filters = {"idIniziativa" : idBando};
    try {
        const response = await fetch(docsIniziativa, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Errore durante la richiesta dei dati');
        }
    } catch (error) {
        throw new Error('Errore durante la richiesta HTTP: ' + error.message);
    }
};

async function getDocFile(docId, format) {
    const filters = {"idDocumento" : docId};
    try {
        const responseCookies = await fetch(docsEndpoint, {
            method: 'POST',
            body: JSON.stringify(filters),
            headers: {'Content-Type': 'application/json'}
        });
        const cookies = responseCookies.headers.getSetCookie();

        // Effettua una richiesta per ottenere il file utilizzando i cookies ottenuti precedentemente
        const responseFile = await fetch(docsEndpoint, {
            method: 'POST',
            body: JSON.stringify(filters),
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            }
        });
        //...
    } catch (error) {
        throw new Error('Errore durante la richiesta HTTP: ' + error.message);
    }
};

module.exports = {
    getListaBandi,
    getDettaglioBando,
    getDocsList,
    getDocFile
}