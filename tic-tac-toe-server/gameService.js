const gameStore = require("./gameStore");
const { normalizeGameData } = require("./lib");
const { v4: uuidv4 } = require('uuid');

async function getAllGames() {
    let allGames = gameStore.map(game => normalizeGameData(game));
    return allGames;
}

async function addNewGame(gameName, nSize = 3) {
    let newGame = { 
        uuid: uuidv4(),
        name: gameName,
        state: [],
        player1: false,
        player2: false,
        lastActivity: null,
        nSize: nSize,
        status: "created",
        win: null
    };
    gameStore.push(newGame);
    return "game created";
}

module.exports = { getAllGames, addNewGame };
