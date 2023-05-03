const { Game } = require("../class/Game");

const gameStore = [];

gameStore.push(new Game("TeamA vs TeamB"));
gameStore.push(new Game("ABCDEF"));

module.exports = gameStore;
