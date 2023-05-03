class Player {
    constructor(socket) {
        this.socket = socket;
    }
    sendMessage(command, data) {
        const msg = {};
        msg.command = command;
        if(data) msg.data = data;
        if(this.socket && this.socket.send) {
            this.socket.send(JSON.stringify(msg));
        }
    }
}

module.exports = { Player };
