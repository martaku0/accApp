const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 1337 }, () => {
    console.log("ws startuje na porcie 1337")
});

//reakcja na podłączenie klienta i odesłanie komunikatu

sendToAllButMe = (data, ws) => {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', (ws, req) => {

    //adres ip klienta

    const clientip = req.connection.remoteAddress;

    console.log('client ')

    //reakcja na komunikat od klienta

    ws.on('message', (message) => {
        const encodedString = message;
        const utf8String = new TextDecoder('utf-8').decode(new TextEncoder().encode(encodedString));
        console.log('serwer odbiera z klienta ' + clientip + ": ", utf8String);
        sendToAllButMe(utf8String, ws)
    });

});