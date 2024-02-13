from bandi import Bandi
import sys
bandi = Bandi()
print("Scarico elenco completo bandi...")
lista = bandi.getListaBandi()
print("Totale elenco: ", len(lista))
for b in lista:
    print(f"Scarico informazioni per bando {b['titoloBando']} ({b['idBando']})...")
    dettagli = bandi.getDettaglioBando(b['idBando'])
    listaDate = dettagli[0]['payload']['dettaglioInformazioniRDO']
    docs = dettagli[1]['payload']['listaDocumentiIniziativa']
    for f in docs:
        bandi.getDocFile(f['idDocumento'], f['formato'])

