class Stopwatch {
    constructor(callback) {
        this.totalSeconds = 10;
        this.timer = null;
        this.onEachSecondCb = callback;
    }
    reset() {
        this.totalSeconds = 10;
        if(this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.totalSeconds = this.totalSeconds - 1;
            if(this.totalSeconds < 0) this.totalSeconds = 0;
            this.onEachSecondCb(this.totalSeconds);
        }, 1000);
    }
    cancel() {
        clearInterval(this.timer);
    }
    getRemaining() {
        return this.totalSeconds;
    }
}

module.exports = { Stopwatch };
