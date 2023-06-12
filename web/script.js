var rotate = false
var current_element = "cube"
var a = 0
var col = 'red'
var all_elements = ["cube"]

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

        if (document.getElementById(current_element)) {
            if (rotate) {
                document.getElementById(current_element).style.transform = `rotate(${xyz.z * 100}deg)`
            } else {
                document.getElementById(current_element).style.left = 500 + xyz.x * (-1000) + "px"
                document.getElementById(current_element).style.top = 500 + xyz.y * 1000 + "px"
            }
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

function stop_here() {
    current_element = ""
}

const isColor = (strColor) => {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== '';
}

function isNumber(value) {
    return !isNaN(value);
}

function new_cube() {
    stop_here()
    current_element = prompt("Podaj nazwę")
    if (current_element === null) {
        return;
    }
    while (all_elements.includes(current_element)) {
        current_element += "-copy"
    }

    a = prompt("Podaj bok")
    if (a === null) {
        return;
    }
    while (isNaN(a) || a <= 0) {
        a = prompt("Błędne wymiary. Podaj bok")
    }

    col = prompt("Podaj kolor")
    if (col === null) {
        return;
    }
    while (!isColor(col)) {
        col = prompt("Błędny kolor. Wybierz coś innego")
    }

    all_elements.push(current_element)

    var elemDiv = document.createElement('div');
    document.body.appendChild(elemDiv);
    elemDiv.id = current_element
    elemDiv.style.backgroundColor = col
    elemDiv.style.width = a + "px"
    elemDiv.style.height = a + "px"
}

function clear_all() {
    if (confirm("Jesteś pewien?")) {
        let cubes = document.querySelectorAll('div')
        cubes.forEach(element => {
            element.remove()
        });
    }
}

function del_last() {
    document.getElementById(`${all_elements[all_elements.length-1]}`).remove()
}