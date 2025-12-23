let time = 25 * 60;
let timerInterval = null;
let startTime = null;
let isRunning = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

function updateDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

startBtn.addEventListener("click", () => {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        if (time > 0) {
            time--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Pomodoro finished! Take a break");
        }
    }, 1000);
});

resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    time = 25 * 60;
    updateDisplay();
});
