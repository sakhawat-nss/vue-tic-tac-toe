function normalizeGameData(game) {
    return ({
        ...game,
        player1: game.player1 && true,
        player2: game.player2 && true,
    });
}

function isValidMove(move, socket, game) {
    if(game.state.indexOf(move) >= 0) return false;
    if(socket !== (game.state.length % 2 === 0? game.player1: game.player2)) return false;
    return true;
}

function getMoveOfLocation(moves, location) {
    const index = moves.indexOf(location);
    if(index < 0) return "-";
    return (index % 2 === 0? "X": "O");
}

function checkWinningPlayer(game) {
    const gameSize = game.nSize;
    const moves = game.state;
    let winning = null;

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
    for(var i = 0; i < gameSize; i++) {
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
    for(var i = 0; i < gameSize; i++) {
        const location = (i + 1) * (gameSize - 1);
        const sign = getMoveOfLocation(moves, location);
        if(!winning) {
            winning = sign;
        }
        winning = (winning === sign? sign: "-");
    }
    if(winning !== "-") return winning;
    
    // no win
    return "-";
}

module.exports = { normalizeGameData, isValidMove, checkWinningPlayer };