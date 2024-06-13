let canvas;
let world;
let keyboard = new Keyboard();


function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

function fullscreen() {
    let fullscreen = document.getElementById('fullscreen');
    enterFullscreen(document.documentElement);
}

function enterFullscreen(element) {
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.msRequestFullscreen) {      // for IE11 (remove June 15, 2022)
      element.msRequestFullscreen();
    } else if(element.webkitRequestFullscreen) {  // iOS Safari
      element.webkitRequestFullscreen();
    }
}

function exitFullscreen() {
    if(document.exitFullscreen) {
      document.exitFullscreen();
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
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