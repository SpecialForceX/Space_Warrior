let canvas;
let world;
let keyboard = new Keyboard();


function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);


}

window.addEventListener("keydown", (event) => {
    if (event.keyCode == 68) {
        keyboard.RIGHT = true;
    }

    if (event.keyCode == 65) {
        keyboard.LEFT = true;
    }

    if (event.keyCode == 87) {
        keyboard.UP = true;
    }

    if (event.keyCode == 83) {
        keyboard.DOWN = true;
    }

    if (event.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (event.keyCode == 13) {
        keyboard.ENTER = true;
    }

})

window.addEventListener("keyup", (event) => {
    if (event.keyCode == 68) {
        keyboard.RIGHT = false;
    }

    if (event.keyCode == 65) {
        keyboard.LEFT = false;
    }

    if (event.keyCode == 87) {
        keyboard.UP = false;
    }

    if (event.keyCode == 83) {
        keyboard.DOWN = false;
    }

    if (event.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (event.keyCode == 13) {
        keyboard.ENTER = false;
    }

})