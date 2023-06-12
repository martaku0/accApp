var rotate = false

window.addEventListener("load", () => {
    const ws = new WebSocket('ws://192.168.18.23:1337');

    //wysłanie danych na serwer przy podłączeniu klienta do serwera

    ws.onopen = () => {
        ws.send('klient się podłączył');
    }

    //odebranie danych z serwera i reakcja na nie, po sekundzie

    ws.onmessage = (e) => {
        let data = e.data.split("|")
        let xyz = {
            x: data[0],
            y: data[1],
            z: data[2]
        }

        if (rotate) {
            document.getElementById('cube').style.transform = `rotate(${xyz.z * 100}deg)`
        } else {
            document.getElementById('cube').style.left = 500 + xyz.x * (-1000) + "px"
            document.getElementById('cube').style.top = 500 + xyz.y * 1000 + "px"
        }
    }

    ws.onerror = (e) => {
        console.log(e.message);
    };

    ws.onclose = (e) => {
        console.log(e.code, e.reason);
    };
})

function change() {
    rotate = !rotate
}