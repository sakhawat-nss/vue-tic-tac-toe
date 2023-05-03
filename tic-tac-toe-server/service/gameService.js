const gameStore = require("../db/games");
const { Game } = require("../class/Game");

async function getAllGames() {
    let allGames = gameStore.map(game => game.gameData());
    return allGames;
}

async function addNewGame(gameName, nSize = 3) {
    let newGame = new Game(gameName);
    gameStore.push(newGame);
    return "game created";
}

function getGameByUUID(uuid) {
    return gameStore.find((g) => g.uuid === uuid);
}

function attachPlayerToGame(player, uuid) {
    const game = getGameByUUID(uuid);
    if(!game) {
        throw "no_game";
    }
    if(game.player1 && game.player2) {
        throw "no_slot";
    }
    game.addPlayer(player);
    return game;
}

function detachPlayerFromGame(player, uuid) {
    const game = getGameByUUID(uuid);
    game.removePlayer(player);
}

function broadcastGameData(uuid) {
    const game = getGameByUUID(uuid);
    game.sendGameStateToPlayers();
}

function addGameMove(player, move, uuid) {
    const game = getGameByUUID(uuid);
    game.giveMove(player, move);
}

function dealRequestBackMove(player, uuid) {
    const game = getGameByUUID(uuid);
    game.requestBack(player);
}

function acceptRequestBackMove(uuid) {
    const game = getGameByUUID(uuid);
    game.revokeOneMove();
}

function rejectRequestBackMove(player, uuid) {
    const game = getGameByUUID(uuid);
    game.rejectBack(player);
}

module.exports = {
    getAllGames,
    addNewGame,
    attachPlayerToGame,
    detachPlayerFromGame,
    broadcastGameData,
    addGameMove,
    dealRequestBackMove,
    acceptRequestBackMove,
    rejectRequestBackMove,
};
