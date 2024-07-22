let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gamePaused = false;
let music = true;
let sounds = true;
let currentMenu = 'main';

const menuImage = new Image();
const settingsImage = new Image();
const controlsImage = new Image();
const soundMenuImage = new Image();
const clickSound = new Audio('audio/sounds/menu_click.ogg');

menuImage.src = 'img/menu/Menu.png';
settingsImage.src = 'img/menu/Settings.png';
controlsImage.src = 'img/menu/controls.png';
soundMenuImage.src = 'img/menu/sound_menu.png';


/**
 * starts the game menu.
 */
function startGameMenu() {
    document.getElementById('startScreen').classList.add('display-none');
    playMusic('menuMusic');
    setInitialVolume();
}

/**
 * Initializes the game by setting up the canvas and showing the main menu.
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    showMenu();
}

function setInitialVolume() {
    document.getElementById('menuMusic').volume = 0.01;
    document.getElementById('levelMusic').volume = 0.01;
    document.getElementById('bossMusic').volume = 0.01;
}

/**
 * Displays the main menu on the canvas.
 */
function showMenu() {
    currentMenu = 'main';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
    showRightButtons();
}

/**
 * Plays a click sound if music is enabled.
 */
function playClickSound() {
    if (sounds) {
        clickSound.play();
        clickSound.volume = 0.05;
    }
}

/**
 * Displays the settings menu.
 */
function showSettings() {
    currentMenu = 'settings';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(settingsImage, 0, 0, canvas.width, canvas.height);
    showRightButtons();
}

/**
 * Displays the controls menu.
 */
function showControls() {
    currentMenu = 'controls';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(controlsImage, 0, 0, canvas.width, canvas.height);
    showRightButtons();
}

/**
 * Displays the sound menu.
 */
function showSoundMenu() {
    currentMenu = 'soundMenu';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(soundMenuImage, 0, 0, canvas.width, canvas.height);
    showRightButtons();
}

/**
 * Shows the appropriate buttons based on the current menu.
 */
function showRightButtons() {
    const buttons = ['playButton', 'settingsButton', 'controlsButton', 'soundsButton', 'imprintButton', 'privacyButton', 'backButton', 'soundEffectsButton', 'soundEffectsHaken'];
    buttons.forEach(button => document.getElementById(button).classList.add('display-none'));

    if (currentMenu === 'main') {
        ['playButton', 'settingsButton', 'controlsButton'].forEach(button => document.getElementById(button).classList.remove('display-none'));
    } else if (currentMenu === 'settings') {
        ['soundsButton', 'imprintButton', 'privacyButton', 'backButton'].forEach(button => document.getElementById(button).classList.remove('display-none'));
    } else if (currentMenu === 'controls') {
        ['backButton'].forEach(button => document.getElementById(button).classList.remove('display-none'));
    } else if (currentMenu === 'soundMenu') {
        ['soundEffectsButton', 'backButton', 'soundEffectsHaken'].forEach(button => document.getElementById(button).classList.remove('display-none'));
        updateSoundButtons();
    }
    updateMusicButtonsVisibility();
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

function showMobileButton() {
    if (isTouchDevice() && window.innerWidth >= 600 && window.innerWidth <= 1368 && gameStarted) {
        document.getElementById('moveLeftButton').classList.remove('display-none');
        document.getElementById('moveRightButton').classList.remove('display-none');
        document.getElementById('jumpButton').classList.remove('display-none');
        document.getElementById('shootButton').classList.remove('display-none');
    } else {
        document.getElementById('moveLeftButton').classList.add('display-none');
        document.getElementById('moveRightButton').classList.add('display-none');
        document.getElementById('jumpButton').classList.add('display-none');
        document.getElementById('shootButton').classList.add('display-none');
    }
}

setInterval(showMobileButton, 500);

/**
 * Starts the game, hides the menu buttons, sets up touch controls, and plays level music.
 */
function startGame() {
    gameStarted = true;
    document.getElementById('playButton').classList.add('display-none');
    document.getElementById('settingsButton').classList.add('display-none');
    document.getElementById('controlsButton').classList.add('display-none');
    setupTouchControls();
    showMobileButton();
    playMusic('levelMusic');
    setInitialVolume();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (world) world = null;
    world = new World(canvas, keyboard);
    gamePaused = false;
    updateMusicButtonsVisibility();
}

/**
 * Plays the specified music track and stops all other music.
 * @param {string} musicId - The ID of the music element to play.
 */
function playMusic(musicId) {
    stopAllMusic();

    const music = document.getElementById(musicId);
    music.volume = 0.5;  // Setze die Lautstärke auf 50%
    music.muted = !music;
    music.play();
}

/**
 * Stops all currently playing music tracks.
 */
function stopAllMusic() {
    const musicElements = document.querySelectorAll('audio');
    musicElements.forEach(music => {
        music.pause();
        music.currentTime = 0;
    });
}

// Continuous check for music and sound settings
function checkSoundSettings() {
    music.volume = 0.1;
    const musicElements = document.querySelectorAll('audio');
    musicElements.forEach(music => {
        music.muted = !music && !music;
    });

    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.muted = !sounds;
    });
}

// Update sound settings every second
setInterval(checkSoundSettings, 1000);

/**
 * Opens the imprint page in a new tab.
 */
function openImprintPage() {
    window.open('html/imprint.html', '_blank');
}

/**
 * Opens the privacy page in a new tab.
 */
function openPrivacyPage() {
    window.open('html/privacy.html', '_blank');
}

/**
 * Toggles sound effects on or off and updates the sound buttons.
 */
function toggleSoundEffects() {
    sounds = !sounds;
    updateSoundButtons();
    if (world) {  // Check if world is defined
        world.muted = sounds;
        world.muteSounds();  // Call muteSounds to update sound settings
    }
}

/**
 * Toggles music on or off and updates the sound buttons.
 */
function toggleMusic() {
    music = !music;
    updateSoundButtons();
    if (world) {  // Check if world is defined
        world.muted = music;
        world.muteSounds();  // Call muteSounds to update sound settings
        
    }
}

/**
 * Updates the sound buttons to reflect the current state of sound effects and music.
 */
function updateSoundButtons() {
    document.getElementById('soundEffectsHaken').src = sounds ? 'img/menu/haken_selected.png' : 'img/menu/haken_unselected.png';
}

/**
 * Updates the visibility of music buttons based on the sound settings and game state.
 */
function updateMusicButtonsVisibility() {
    const musicButtonOn = document.getElementById('musicButtonOn');
    const musicButtonOff = document.getElementById('musicButtonOff');

    if (gameStarted) {
        // Show musicOn button if sounds is true, otherwise show musicOff button
        musicButtonOn.classList.toggle('display-none', !sounds);
        musicButtonOff.classList.toggle('display-none', sounds);
    } else {
        // Hide both buttons if the game has not started
        musicButtonOn.classList.add('display-none');
        musicButtonOff.classList.add('display-none');
    }
}

/**
 * Sets up touch controls for mobile devices.
 */
function setupTouchControls() {
    const moveLeftButton = document.getElementById('moveLeftButton');
    const moveRightButton = document.getElementById('moveRightButton');
    const jumpButton = document.getElementById('jumpButton');
    const shootButton = document.getElementById('shootButton');

    moveLeftButton.addEventListener('touchstart', () => {
        keyboard.LEFT = true;
    });

    moveLeftButton.addEventListener('touchend', () => {
        keyboard.LEFT = false;
    });

    moveRightButton.addEventListener('touchstart', () => {
        keyboard.RIGHT = true;
    });

    moveRightButton.addEventListener('touchend', () => {
        keyboard.RIGHT = false;
    });

    jumpButton.addEventListener('touchstart', () => {
        keyboard.SPACE = true;
    });

    jumpButton.addEventListener('touchend', () => {
        keyboard.SPACE = false;
    });

    shootButton.addEventListener('touchstart', () => {
        keyboard.ENTER = true;
    });

    shootButton.addEventListener('touchend', () => {
        keyboard.ENTER = false;
    });
}

/**
 * Toggles the game pause state.
 */
function togglePause() {
    if (gameStarted) {
        gamePaused = !gamePaused;
        if (!gamePaused) resumeEnemyAnimation();
    }
}

/**
 * Resumes animation for all alive enemies.
 */
function resumeEnemyAnimation() {
    world.level.enemies.forEach(enemy => {
        if (enemy instanceof Alien2 && enemy.isAlive) enemy.animate();
    });
}

/**
 * Handles keyboard keydown events.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleKeyDown(event) {
    if (event.keyCode == 68) keyboard.RIGHT = true;
    if (event.keyCode == 65) keyboard.LEFT = true;
    if (event.keyCode == 87) keyboard.UP = true;
    if (event.keyCode == 83) keyboard.DOWN = true;
    if (event.keyCode == 32) keyboard.SPACE = true;
    if (event.keyCode == 13) keyboard.ENTER = true;
}

/**
 * Handles keyboard keyup events.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleKeyUp(event) {
    if (event.keyCode == 68) keyboard.RIGHT = false;
    if (event.keyCode == 65) keyboard.LEFT = false;
    if (event.keyCode == 87) keyboard.UP = false;
    if (event.keyCode == 83) keyboard.DOWN = false;
    if (event.keyCode == 32) keyboard.SPACE = false;
    if (event.keyCode == 13) keyboard.ENTER = false;
}

// Event-Listener für Pausen-Taste (z.B. "P")
document.addEventListener('keydown', (event) => {
    if (event.key === 'P' || event.key === 'p') togglePause();
});

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

// Initialisieren Sie das Menü
window.addEventListener('load', init);
