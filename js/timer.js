let timer;
let timeLeft;
let initialTime = 0;
let isPaused = true;

function getTimeInput() {
    const input = window.location.pathname.split('/')[1];
    return input && input.trim().length > 0 ? input : "1:00";
}

function parseTime(input) {
    const parts = input.split(':');
    let minutes = 0;
    let seconds = 0;

    if (parts.length === 2) {
        minutes = parseInt(parts[0], 10);
        seconds = parseInt(parts[1], 10);
    } else if (parts.length === 1) {
        seconds = parseInt(parts[0], 10);
    }

    return minutes * 60 + seconds;
}

function updateDisplay() {
    const display = document.getElementById('timer-display');
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    display.textContent = formatted;
    document.title = formatted;

    // Update the progress circle:
    if (initialTime > 0) {
        const progressCircle = document.getElementById('progress-ring');
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        progressCircle.style.strokeDasharray = `${circumference}`;
        const progress = timeLeft / initialTime;
        progressCircle.style.strokeDashoffset = circumference * (1 - progress);
    }
}

function startTimer() {
    if (isPaused) {
        // Reset if timer is finished.
        if (timeLeft <= 0) {
            const timeInput = getTimeInput();
            timeLeft = parseTime(timeInput);
            initialTime = timeLeft;
            updateDisplay();
        }

        isPaused = false;
        document.getElementById('play-button').disabled = true;
        document.getElementById('pause-button').disabled = false;
        document.getElementById('restart-button').disabled = false;

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
                if (timeLeft === 0) {
                    clearInterval(timer);
                    playAlarm();
                    // Disable pause when time is up.
                    document.getElementById('pause-button').disabled = true;
                    document.getElementById('play-button').disabled = false;
                    isPaused = true;
                }
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (!isPaused) {
        isPaused = true;
        clearInterval(timer);
        document.getElementById('play-button').disabled = false;
        document.getElementById('pause-button').disabled = true;
    }
}

function restartTimer() {
    pauseTimer();
    const timeInput = getTimeInput();
    timeLeft = parseTime(timeInput);
    initialTime = timeLeft;
    updateDisplay();
    // Reset button states: ready to start.
    document.getElementById('play-button').disabled = false;
    document.getElementById('pause-button').disabled = true;
    document.getElementById('restart-button').disabled = false;
}

function playAlarm() {
    const audio = new Audio('assets/alarm.flac');
    audio.play();
}

// Add event listener for keydown event
document.addEventListener('keydown', function(event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.key === 'Enter' || event.keyCode === 13) {
        // If the play button is not disabled, click it
        const playButton = document.getElementById('play-button');
        if (!playButton.disabled) {
            playButton.click();
        }
    }
});

window.onload = () => {
    const timeInput = getTimeInput();
    timeLeft = parseTime(timeInput);
    initialTime = timeLeft;
    updateDisplay();

    document.getElementById('play-button').onclick = startTimer;
    document.getElementById('pause-button').onclick = pauseTimer;
    document.getElementById('restart-button').onclick = restartTimer;
};