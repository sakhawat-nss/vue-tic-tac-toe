const { getAllGames, addNewGame } = require("./service/gameService");
const { connectWebSocket } = require("./service/wsService");

function success(data) {
    return {
        status: "success",
        data: data,
    };
}

async function getGames(req, res, next) {
    try {
        let data = await getAllGames();
        res.send(success(data));
    }
    catch(err) {
        next(err);
    }
}

async function addGame(req, res, next) {
    try {
        const gameName = req.body.gameName;
        if(!gameName) {
            throw "Missing game name..."
        }
        let data = await addNewGame(gameName, 3);
        res.send(success(data));
    }
    catch(err) {
        next(err);
    }
}

async function connectWSS(ws, req) {
    try {
        const uuid = req.params.uuid;
        connectWebSocket(ws, uuid);
    }
    catch(err) {
        console.error(err);
        ws.close(1011, err);
    }
}

module.exports = { getGames, addGame, connectWSS };
