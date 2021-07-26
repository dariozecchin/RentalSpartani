######### RENTALSPARTANI.COM #########

Membri del progetto:

    Linari Luca - email = luca.linari2@studio.unibo.it - NM = 0000900644

    Rossi Alessandro - email = alessandro.rossi61@studio.unibo.it - NM = 0000874901

    Zecchin Dario - email = dario.zecchin@studio.unibo.it - NM = 0000882583

#######################################################

ISTRUZIONI PER ESEGUIRE:

    Aver installato Express
    Ambiente AMP ( xampp, mamp ... ) o server MySQL
    Download o cloan il progetto nel link : https://github.com/AlessandroRossi98/RentalSpartani.git
    Importare il file "NoloDB.sql " nel server MySQL
    Aprire database.js e inserire le credenziali su cui si è salvato il Database
    Installare i node_modules con "npm install" nel path della cartella 
    Nel terminal nel path del progetto digita npm start.
    Digitare nel browser : "localhost:3000"

######################################################

BREVE DESCRIZIONE DEL PROGETTO :

Abientato nel periodo classico greco, RentalSpartani.com e' una piattaforma di fantasia che si occupa del "noleggio" per periodi medio-brevi di guerrieri mercenari addestrati direttamente dai gestori del sito.

Il sito è quindi finalizzato alla prenotazione di guerrieri e tutto ciò che può rendere più confortevole e semplice l'esperienza del cliente.

Il sito è composto da 4 pagine che sono visibili anche senza un account: l'homepage, la pagina di ogni guerriero (senza però poterlo prenotare), le statistiche e i contatti. Dopo aver effettuato l'accesso, gli utenti con un account, oltre a poter completare una prenotazione nella pagina dei guerrieri, possono anche accedere alla pagina profilo.

La pagina profilo è diversa per un amministratore e un cliente. Il primo potrà gestire praticamente ogni aspetto del sito (prenotazione, guerrieri e utenti) mentre il secondo potrà solamente gestire i propri dati personali e le proprie prenotazioni.

Modalità di noleggio: 
Homepage:
    Per scegliere il guerriero da noleggiare si può scorrere tra tutti i guerrieri e sceglierne uno oppure selezionare l'abilità richiesta e il periodo in cui lo si cerca e scegliere     tra i risultati. 
    Una volta cliccato sul guerriero scelto si verrà indirizzati alla pagina del singolo guerriero. 
Pagina del guerriero:
    Nella pagina del guerriero, il cliente può vedere nel dettaglio tutte le caratteristiche del guerriero e se convinto della scelta può direttamente prenotare il guerriero (a patto     che abbia eseguito il login). Per prenotare vi è solamente da definire una data controllando che non sia già occupata (qualora lo fosse e si provi a prenotare si verrà               reindirizzati in una pagina di errore che spiegherà il problema), scegliere se si vuole sottoscrivere un'assicurazione e cliccare sul bottone della prenotazione. 
 Pagina del profilo:
    Il cliente potrà controllare e cambiare la data delle prenotazioni attive e future (sempre se il guerriero è disponibile nel nuovo periodo selezionato), controllare le fatture       delle prenotazioni terminate e scrivere recensioni su guerrieri che ha noleggiato.

Termine di un noleggio: Un noleggio termina quando l'amministratore manualmente clicca il bottone di fine prestito nella sua pagina del profilo. Il bottone fa anche generare la fattura che dovrà pagare il cliente calcolando anche le eventuali penali.

Penali e sconti: Il sito prevede penali e sconti. Le penali possono esserci per due fattori: il guerriero restituito è peggiorato fisicamente rispetto a quando è stato noleggiato (ex. da Ottimo a Infortunato) oppure per il ritardo nella riconsegna del guerriero. La prima penale può essere evitato con l'assicurazione. Lo sconto (del 10% sul totale del noleggio) è per gli utenti ogni 10 noleggi.
