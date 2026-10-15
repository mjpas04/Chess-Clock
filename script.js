let timeControlChoice = 10; // minutes, default
let timeLeft = [0, 0];      // milliseconds: index 0 = player 1, index 1 = player 2
let activePlayer = null;    // 0, 1, or null when no clock is running
let lastTick = 0;
let intervalId = null;

// A clock is running whenever there is an active player
function isClockRunning() {
  return activePlayer !== null;
}

// Disable the time-control buttons while a clock is running
function updateTimeControls() {
  const locked = isClockRunning();
  timeButtons.forEach(btn => { btn.disabled = locked; });
}

// Only accept a time-control choice if no clock is running
function onTimeControlTap(minutes) {
  if (isClockRunning()) return;
  setTime(minutes);
}

const buttons = [
  document.getElementById('player1'),
  document.getElementById('player2'),
];
const displays = [
  document.getElementById('time1'),
  document.getElementById('time2'),
];
const timeButtons = document.querySelectorAll('#time-controls button');

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function updateDisplay() {
  displays[0].textContent = formatTime(timeLeft[0]);
  displays[1].textContent = formatTime(timeLeft[1]);
}

// Reset the game to the chosen time control
function setTime(minutes) {
  stopClock();
  clearMessage();
  timeControlChoice = minutes;
  timeLeft = [minutes * 60000, minutes * 60000];
  buttons.forEach(b => b.classList.remove('active'));
  updateDisplay();
}

function startClock(player) {
  clearMessage();
  activePlayer = player;
  lastTick = performance.now();
  buttons[player].classList.add('active');
  intervalId = setInterval(tick, 100);
  updateTimeControls();
}

// Stop whichever clock is running
function stopClock() {
  clearInterval(intervalId);
  intervalId = null;
  if (activePlayer !== null) {
    buttons[activePlayer].classList.remove('active');
  }
  activePlayer = null;
  updateTimeControls(); 
}

// Runs every 100ms: subtract the real elapsed time from the active player
function tick() {
  const now = performance.now();
  timeLeft[activePlayer] -= now - lastTick;
  lastTick = now;

  if (timeLeft[activePlayer] <= 0) {
    timeLeft[activePlayer] = 0;
    updateDisplay();
    onTimeOut(activePlayer);
    return;
  }
  updateDisplay();
}

function onTimeOut(player) {
  const loser = player === 0 ? 'White' : 'Black';
  const winner = player === 0 ? 'Black' : 'White';
  setTime(timeControlChoice);   // stops the clock and resets both times
  showMessage(`${loser} ran out of time. ${winner} wins!`);
}

// Handles a tap from either player
function onPlayerTap(player) {
  if (activePlayer === null) {
    startClock(1 - player);            // game not running: start this player's clock
  } else if (activePlayer === player) {
    stopClock();                   // stop my clock...
    startClock(1 - player);        // ...and start the opponent's
  }
  // otherwise it's not this player's turn, so ignore the tap
}

// Forfeit: stop the game and reset both clocks to the current time control
function onStopTap() {
  setTime(timeControlChoice);
}

function onStopTap() {
  if (isClockRunning() && !confirm('Forfeit and reset the game?')) return;
  setTime(timeControlChoice);
}

document.getElementById('stop-button').addEventListener('click', onStopTap);
const messageEl = document.getElementById('message');

function showMessage(text) {
  messageEl.textContent = text;
}

function clearMessage() {
  messageEl.textContent = '';
}


function onPlayer1Tap() { onPlayerTap(0); }
function onPlayer2Tap() { onPlayerTap(1); }

buttons[0].addEventListener('click', onPlayer1Tap);
buttons[1].addEventListener('click', onPlayer2Tap);

setTime(timeControlChoice); 