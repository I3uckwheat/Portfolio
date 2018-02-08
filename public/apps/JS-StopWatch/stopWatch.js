"use strict";
const timerDisplay = document.getElementById("stopWatchDisplay");
const resetButton = document.getElementById("reset");
const pastTimes = document.getElementById("pastTimes");
const startStopButton = document.getElementById("startStop");
const recordButton = document.getElementById("recordTime");
let interval;
let timerValue = 0;

startStopButton.addEventListener("click", () => interval ? stopClock() : startClock());

resetButton.addEventListener("click", () => {
  stopClock();
  timerValue = 0
  timerDisplay.textContent = 0;
  pastTimes.innerHTML = "";
});

recordButton.addEventListener("click", () => {
  const time = document.createElement("p");
  time.textContent = timerValue / 100;
  pastTimes.appendChild(time);
});

document.addEventListener("keypress", e => {
  const keys = {
    s: startStopbutton,
    t: recordButton,
    r: resetButton
  }
  keys[e.key].click();
})

function startClock(){
  interval = setInterval(() => {
    timerValue++
    timerDisplay.textContent = timerValue / 100;
  }, 10)
}

function stopClock(){
  clearInterval(interval);
  interval = null;
}
