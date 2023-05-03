const { Player } = require("../class/Player");
const {
    attachPlayerToGame,
    detachPlayerFromGame,
    broadcastGameData,
    addGameMove,
    dealRequestBackMove,
    acceptRequestBackMove,
    rejectRequestBackMove,
} = require("./gameService");

function connectWebSocket(socket, uuid) {
    const player = new Player(socket);
    attachPlayerToGame(player, uuid);

    socket.on("message", (msg) => {
        processWsData(msg, player, uuid);
    });
    socket.on("error", (err) => {
        console.log("Error: ", err);
    });
    socket.on("close", (data) => {
        detachPlayerFromGame(player, uuid);
    });
}

function processWsData(msg, player, uuid) {
    try {
        const {command, data } = JSON.parse(msg);
        switch(command) {
            case "getGameData":
                broadcastGameData(uuid);
                break;
            case "giveMove":
                addGameMove(player, data, uuid);
                break;
            case "requestBack":
                dealRequestBackMove(player, uuid);
                break;
            case "confirmBack":
                acceptRequestBackMove(uuid);
                break;
            case "rejectBack":
                rejectRequestBackMove(player, uuid);
                break;
            default:
                console.log(msg);
        }
    }
    catch(err) {
        console.error(err);
    }
}

module.exports = { connectWebSocket };
