const { v4: uuidv4 } = require('uuid');
const { Stopwatch } = require('./Stopwatch');

class Game {
    constructor(name) {
        this.uuid = uuidv4();
        this.name = name;
        this.state = [];
        this.player1 = null;
        this.player2 = null;
        this.lastActivity = null;
        this.nSize = 3;
        this.status = "created";
        this.win = null;
        this.onMessage = () => {};
        this.timer = new Stopwatch((t) => {
            this.timerEvent(t);
        });
    }
    gameData() {
        let data = {
            uuid: this.uuid,
            name: this.name,
            state: this.state,
            player1: this.player1 && true,
            player2: this.player2 && true,
            lastActivity: this.lastActivity,
            nSize: this.nSize,
            status: this.status,
            win: this.win,
            remaining: (this.status === "running"? this.timer.getRemaining(): 0)
        };
        return data;
    }
    isValidMove(player, move) {
        if(this.state.indexOf(move) >= 0) return false;
        if(player !== (this.state.length % 2 === 0? this.player1: this.player2)) return false;
        return true;
    }
    getWinningPlayer() {
        const gameSize = this.nSize;
        const moves = this.state;
        let winning = null;
    
        function getMoveOfLocation(moves, location) {
            const index = moves.indexOf(location);
            if(index < 0) return "-";
            return (index % 2 === 0? "X": "O");
        }
    
        // row
        for(let i = 0; i < gameSize; i++) {
            winning = null;
            for(let j = 0; j < gameSize; j++) {
                const location = (i*gameSize) + j;
                const sign = getMoveOfLocation(moves, location);
                if(!winning) {
                    winning = sign;
                }
                winning = (winning === sign? sign: "-");
            }
            if(winning !== "-") return winning;
        }
    
        // col
        for(let i = 0; i < gameSize; i++) {
            winning = null;
            for(let j = 0; j < gameSize; j++) {
                const location = i + (j * gameSize);
                const sign = getMoveOfLocation(moves, location);
                if(!winning) {
                    winning = sign;
                }
                winning = (winning === sign? sign: "-");
            }
            if(winning !== "-") return winning;
        }
    
        // cross FS
        winning = null;
        for(let i = 0; i < gameSize; i++) {
            const location = i + (i * gameSize);
            const sign = getMoveOfLocation(moves, location);
            if(!winning) {
                winning = sign;
            }
            winning = (winning === sign? sign: "-");
        }
        if(winning !== "-") return winning;
    
        // cross BS
        winning = null;
        for(let i = 0; i < gameSize; i++) {
            const location = (i + 1) * (gameSize - 1);
            const sign = getMoveOfLocation(moves, location);
            if(!winning) {
                winning = sign;
            }
            winning = (winning === sign? sign: "-");
        }
        if(winning !== "-") return winning;

        if(moves.length === (this.nSize * this.nSize)) {
            return "-";
        }
        else {
            return null;
        }
    }
    gameDataForPlayer(player) {
        const gameState = {};
        const playerSign = (player === this.player1? "X": (player === this.player2? "O": "-"));
        gameState.game = this.gameData();
        gameState.player = {
            sign: playerSign
        }
        return gameState;
    }
    addPlayer(player) {
        if(!this.player1) {
            this.player1 = player;
        }
        else if(!this.player2) {
            this.player2 = player;
        }
        if(this.player1 && this.player2 && this.status !== "completed") {
            this.status = "running";
            this.lastActivity = Date.now();
            this.timer.reset();
        }
    }
    removePlayer(player) {
        if(this.player1 === player) this.player1 = null;
        if(this.player2 === player) this.player2 = null;
    }
    giveMove(player, move) {
        if(this.isValidMove(player, move)) {
            this.state.push(move);
            this.lastActivity = Date.now();

            const win = this.getWinningPlayer();
            if(win) {
                this.status = "completed";
                this.win = win;
                this.timer.cancel();
                this.sendGameStateToPlayers(true);
            }
            else {
                this.timer.reset();
                this.sendGameStateToPlayers();
            }
        }
        else {
            player.sendMessage("invalidMove", move);
        }
    }
    revokeOneMove() {
        this.state.pop();
        this.lastActivity = Date.now();
        this.timer.reset();
        this.sendGameStateToPlayers();
    }
    sendGameStateToPlayers(isWin = false) {
        if(isWin) {
            const defaultOpWinMsg = (this.win === "-"? "draw": "oponentWon");
            if(this.player1) this.player1.sendMessage((this.win === "X"? "youWon": defaultOpWinMsg), this.gameDataForPlayer(this.player1));
            if(this.player2) this.player2.sendMessage((this.win === "O"? "youWon": defaultOpWinMsg), this.gameDataForPlayer(this.player2));
        }
        else {
            if(this.player1) this.player1.sendMessage("gameState", this.gameDataForPlayer(this.player1));
            if(this.player2) this.player2.sendMessage("gameState", this.gameDataForPlayer(this.player2));
        }
    }
    requestBack(player) {
        let sendTo = null;
        if(player === this.player1) sendTo = this.player2;
        else sendTo = this.player1;
        if(sendTo) sendTo.sendMessage("requestBack", null);
    }
    rejectBack(player) {
        let sendTo = null;
        if(player === this.player1) sendTo = this.player2;
        else sendTo = this.player1;
        if(sendTo) sendTo.sendMessage("rejectBack", null);
    }
    timerEvent(remainingSeconds) {
        if(remainingSeconds === 0) {
            const nextMoveOf = (this.state.length % 2 === 0? "X": "O");
            this.status = "completed";
            this.win = (nextMoveOf === "X"? "O": "X");
            this.timer.cancel();
            this.sendGameStateToPlayers(true);
        }
        else {
            this.sendGameStateToPlayers();
        }
    }
}

module.exports = { Game };
