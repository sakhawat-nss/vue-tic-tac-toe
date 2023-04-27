const gameStore = require("./gameStore");
const { normalizeGameData, isValidMove, checkWinningPlayer } = require("./lib");

function createGameStateForPlayer(player, game) {
    const gameState = {};
    const playerSign = (player === game.player1? "X": (player === game.player2? "O": "-"));
    gameState.game = normalizeGameData(game);
    gameState.player = {
        sign: playerSign
    }
    return gameState;
}

function updateGameData(game, newData) {
    Object.keys(newData).forEach(key => game[key] = newData[key]);
    if(game.player1) sendWsData(game.player1, "gameState", createGameStateForPlayer(game.player1, game));
    if(game.player2) sendWsData(game.player2, "gameState", createGameStateForPlayer(game.player2, game));
    if(newData.win && newData.win !== "-") {
        sendWsData(game.player1, (game.win === "X"? "youWon": "oponentWon"), createGameStateForPlayer(game.player1, game));
        sendWsData(game.player2, (game.win === "O"? "youWon": "oponentWon"), createGameStateForPlayer(game.player2, game));
    }
    return game;
}

function prepareGame(socket, uuid) {
    const game = gameStore.find((g) => g.uuid === uuid);
    if(!game) {
        throw "no_game";
    }
    if(game.player1 && game.player2) {
        throw "no_slot";
    }
    if(game.status === "completed") {
        return game;
    }
    if(!game.player1) {
        updateGameData(game, { player1: socket});
    }
    else if(!game.player2) {
        updateGameData(game, { player2: socket});
    }
    if(game.player1 && game.player2) {
        updateGameData(game, { status: "running", lastActivity: Date.now()});
    }
    return game;
}

function connectWebSocket(socket, uuid) {
    const game = prepareGame(socket, uuid);

    socket.on("message", (msg) => {
        processWsData(msg, socket, game);
    });
    socket.on("error", (err) => {
        console.log("Error: ", err);
    });
    socket.on("close", (data) => {
        if(game.player1 === socket) game.player1 = null;
        if(game.player2 === socket) game.player2 = null;
    });
}

function processWsData(msg, socket, game) {
    try {
        const {command, data } = JSON.parse(msg);
        switch(command) {
            case "getGameData":
                sendWsData(socket, "gameState", createGameStateForPlayer(socket, game));
                break;
            case "giveMove":
                giveMove(data, socket, game);
                break;
            case "requestBack":
                sendWsData((socket === game.player1? game.player2: game.player1), "requestBack", null);
                break;
            case "confirmBack":
                revokeOneMove(socket, game);
                break;
            case "rejectBack":
                sendWsData((socket === game.player1? game.player2: game.player1), "rejectBack", null);
                break;
            default:
                console.log(msg);
        }
    }
    catch(err) {
        console.error(err);
    }
}

function sendWsData(socket, command, data) {
    const msg = {};
    msg.command = command;
    if(data) msg.data = data;
    if(socket.send) {
        socket.send(JSON.stringify(msg));
    }
}

const timeoutMap = new Map();

function giveMove(move, socket, game) {
    if(isValidMove(move, socket, game)) {
        const newGameState = [...game.state, move];
        setNewGameState(newGameState, socket, game);
    }
    else {
        sendWsData(socket, "invalidMove", move);
    }
}

function revokeOneMove(socket, game) {
    const newGameState = [...game.state];
    newGameState.pop();
    setNewGameState(newGameState, socket, game);
}

function setNewGameState(newGameState, socket, game) {
    const currentTime = Date.now();
    updateGameData(game, { state: newGameState, lastActivity: currentTime});
    const timeout = timeoutMap.get(game);
    if(timeout) clearTimeout(timeout);

    const win = checkWinningPlayer(game);
    if(win !== "-") {
        updateGameData(game, { status: "completed", win: win});
    }
    else if(game.state.length === (game.nSize * game.nSize)) {
        updateGameData(game, { status: "completed", win: "-"});
    }
    else {
        timeoutMap.set(game, setTimeout(() => {
            const winByTime = (socket === game.player1? "X": "O");
            updateGameData(game, { status: "completed", win: winByTime});
        }, 10000));
    }
    
}

module.exports = { connectWebSocket };
