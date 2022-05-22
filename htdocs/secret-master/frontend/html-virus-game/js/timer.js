var elapsedTimeText = document.getElementById('time-elapsed-text');
var elapsedTimeIntervalRef;
var startTime;
var elapsedTimeWhenPaused;

function startStopwatch() {
    setStartTime();
    elapsedTimeIntervalRef = setInterval(() => {
        
        elapsedTimeText.innerHTML = timeAndDateHandling.getElapsedTime(startTime);

    }, 1000);
}


function setStartTime() {
    if (elapsedTimeWhenPaused) {
        startTime = new Date();
        startTime.setHours(startTime.getHours() - elapsedTimeWhenPaused.hours);
        startTime.setMinutes(startTime.getMinutes() - elapsedTimeWhenPaused.minutes);
        startTime.setSeconds(startTime.getSeconds() - elapsedTimeWhenPaused.seconds);
    } else {
        startTime = new Date();
    }
}

function stopStopwatch() {
    if (typeof elapsedTimeIntervalRef !== "undefined") {
        clearInterval(elapsedTimeIntervalRef);
        elapsedTimeIntervalRef = undefined;
    }
    storeElapsedTimeOnPause();
}

function storeElapsedTimeOnPause() {
    const brokenDownElapsedTime = elapsedTimeText.innerHTML.split(":");
    const brokenDownElapsedTimeAsNumbers = brokenDownElapsedTime.map(numberAsString => parseInt(numberAsString));

    elapsedTimeWhenPaused = {
        hours: brokenDownElapsedTimeAsNumbers.length === 3 ? brokenDownElapsedTimeAsNumbers[0] : 0,
        minutes: brokenDownElapsedTimeAsNumbers.length === 3 ? brokenDownElapsedTimeAsNumbers[1] : brokenDownElapsedTimeAsNumbers[0],
        seconds: brokenDownElapsedTimeAsNumbers.length === 3 ? brokenDownElapsedTimeAsNumbers[2] : brokenDownElapsedTimeAsNumbers[1]
    }
}

function resetStopwatch() {
    if (typeof elapsedTimeIntervalRef !== "undefined") {
        clearInterval(elapsedTimeIntervalRef);
        elapsedTimeIntervalRef = undefined;
    }

    elapsedTimeWhenPaused = undefined
    elapsedTimeText.innerHTML = "00:00";
}

var timeAndDateHandling = {
    /** Computes the elapsed time since the moment the function is called in the format mm:ss or hh:mm:ss
     * @param {String} startTime - start time to compute the elapsed time since
     * @returns {String} elapsed time in mm:ss format or hh:mm:ss format if elapsed hours are 0.
     */
    getElapsedTime: function (startTime) {

        
        let endTime = new Date();
        let timeDiff = endTime.getTime() - startTime.getTime();
        timeDiff = timeDiff / 1000;
        let seconds = Math.floor(timeDiff % 60);
        let secondsAsString = seconds < 10 ? "0" + seconds : seconds + "";
        timeDiff = Math.floor(timeDiff / 60);
        let minutes = timeDiff % 60;
        let minutesAsString = minutes < 10 ? "0" + minutes : minutes + "";
        timeDiff = Math.floor(timeDiff / 60);
        let hours = timeDiff % 24;
        timeDiff = Math.floor(timeDiff / 24);
        let days = timeDiff;

        let totalHours = hours + (days * 24);
        let totalHoursAsString = totalHours < 10 ? "0" + totalHours : totalHours + "";

        if (totalHoursAsString === "00") {
            return minutesAsString + ":" + secondsAsString;
        } else {
            return totalHoursAsString + ":" + minutesAsString + ":" + secondsAsString;
        }
    }
}