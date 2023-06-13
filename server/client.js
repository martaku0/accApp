import sett from "./settings.json"


const WebSocket = require('ws');

const ws = new WebSocket(`ws://${sett.address}:${sett.port}`);

//wysłanie danych na serwer przy podłączeniu klienta do serwera

ws.onopen = () => {
    ws.send('klient się podłączył');
}

//odebranie danych z serwera i reakcja na nie, po sekundzie

ws.onmessage = (e) => {
    console.log(e.data);
    setTimeout(function() {
        ws.send("timestamp z klienta: " + Date.now());
    }, 1000);
}

ws.onerror = (e) => {
    console.log(e.message);
};

ws.onclose = (e) => {
    console.log(e.code, e.reason);
};