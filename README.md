Benvenuti! 😊

Al momento siamo ancora in ambiente di sviluppo ⚒️, ma a breve il progetto potrà essere disponibile online affinché tutti possano provare direttamente come funziona 
(a questo indirizzo: https://my-pizza.giuliomarinelli.com). 
L'ambiente di produzione 🏭 è quasi pronto, per chiudere il cerchio è in corso la realizzazione di un web server Nginx 🖥️ che funzioni da Reverse Proxy, permettendo ai server Tomcat e Netty-Socket.io di lavorare in un'unica porta🚪.

DESCRIZIONE DEL PROGETTO 👌

Questo è il prototipo demo di un'app per ordinare per asporto da pizzerie e ristoranti 🍕

Esistono già diversi servizi come ad esempio JustEat che svolgono un lavoro simile, ma sono disponibili solo in città. Quest'app ha un obiettivo diverso: ci sono molte pizzerie e ristoranti di provincia che non sono coperte da servizi come appunto JustEat e hanno i loro personali riders.

Questa applicazione è dedicata a tutti i ristoranti e pizzerie di provincia che vogliono gestire gli ordini con notifiche in tempo reale e permettere ai clienti di ordinare da app anziché telefonando ☎️

L'applicazione fornisce un'interfaccia gestionale per il personale del ristorante e un'interfaccia user-friendly per il cliente

In questa versione (1.0.0beta4d) sono state implementate tutte le funzionalità, da parte del ristorante 🍕, per:

- Ricevere notifiche di ordine in tempo reale da parte del cliente
- Accettare o rifiutare un ordine
- Avvisare il cliente che l'ordine è pronto
- Gestire in modo ordinato gli ordini in arrivo, in lavorazione e completati
- Avere a disposizione un'interfaccia pubblica realizzata in server-side-rendering altamente SEO-friendly per poter essere facilmente trovati con i motori di ricerca e con velocità di caricamento delle pagine molto alta
- Aggiungere, modificare o eliminare prodotti, ingredienti e gestire il menu.

Per quanto riguarda il cliente 👱🏻‍♂️, egli può comodamente selezionare i prodotti da ordinare e la quantità e inviare l'ordine; riceverà una notifica istantanea quando l'ordine sarà stato accettato, e un'altra notifica quando l'ordine sarà pronto e starà per essere consegnato.

In questi 28 giorni di lavoro mi sono concentrato con la massima attenzione e con molta tenacia su tre aspetti fondamentali:
1) Velocità. Credo che un'applicazione veloce sia un'applicazione amica 😄 dell'utente. Ho lavorato sul multithreading di Java, cercando anche quando possibile di fare sempre stream paralleli e non sequenziali.
   Ho lavorato sulle relazioni del database: il mio approccio è stato quello di preferire il più possibile relazioni unidirezionali, alleggerendo il carico di lavoro di Postgre, e in ogni caso preferire, quando possibile, la modalità lazy.
   Inoltre nelle pagine che possono caricare grandi moli di dati ho usato la paginazione abbinata ad un lazy-loading in stile infinite-scroll oppure ho fatto in modo che il server restituisse uno stream continuo di dati anziché un unico pesante bolo.
2) Istantaneità della comunicazione cliente-ristorante e ristorante-cliente. A tal scopo ho implementato l'interfaccia con un websocket lavorando con la libreria Socket.io.
3) Sicurezza: ho gestito un sistema di autenticazione un po' meno "didattico" cercando di avere un approccio un po' più professionale. Ho utilizzato una coppia di access token e refresh token rispettivamente per http e websocket.
Il sistema di autenticazione e autorizzazione inoltre lavora con i cookie. Per quanto concerne gli endpoint http autenticati, ho messo a punto un sistema di refresh automatico lato-server che permette di lavorare tranquillamente con access token di 15 secondi.  

=> L'applicazione attende release future. Oltre ad alcuni bugfix minori, potranno essere implementate tutta una serie di funzionalità.

Un progetto futuro distinto da questo ma al tempo stesso collegato prevederà la realizzazione di una copia esatta del backend di quest'app, qui realizzato in Java e Spring Boot, con Hibernate come framework di interfacciamento con i database relazionali, in Node.js, utilizzando il framework Nest.js (da qualcuno chiamato lo Spring di node) e TypeOrm (molto simile ad Hibernate, ma che gira in TypeScript)
