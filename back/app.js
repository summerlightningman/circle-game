class App {
    constructor() {
        this.roomList = [
            {id: 1, name: 'First', players: []},
            {id: 2, name: 'Second', players: []},
            {id: 3, name: 'Third', players: []},
        ]

        this.names = require('./db.js');
    }

    getRandomName = () => {
        const randNum = Math.round(Math.random() * this.names.length);
        return this.names[randNum]
    }

    getRandomColor = () => {
        const rand0to255 = () => Math.round(Math.random() * 255);
        return `rgb(${rand0to255()},${rand0to255()},${rand0to255()})`
    }

    getRandomNumber = (from, to) => {
        return Math.floor(from + Math.random() * (to - from))
    }

    helloWorld = (req, res) => {
        res.type('text/html');
        return res.send('<h1>Hello world!</h1>');
    }

    listRooms = (req, res) => {
        res.type('application/json');
        const roomInfos = this.roomList.map(room => ({id: room.id, name: room.name, userCount: room.players.length}));
        return res.json(roomInfos);
    }

    findRoomIdxByPlayer = (id, idx = 0) => {
        if (this.roomList.length >= idx)
            return

        if (this.roomList[idx].players.some(player => player.id === id))
            return idx

        return this.findRoomIdxByPlayer(id, idx + 1)
    }

    onSocketConnection = sock => {
        const player = {
            id: sock.id,
            name: this.getRandomName(),
            color: this.getRandomColor(),
            radius: this.getRandomNumber(50, 150),
            x: this.getRandomNumber(250, 500),
            y: this.getRandomNumber(300, 600)
        }

        console.log(`User connected ${player.id}. User's name is ${player.name}`);

        sock.on('join', msg => {
            const roomIdx = this.roomList.findIndex(room => room.id === +msg.id);

            this.roomList[roomIdx].players.push(player);
            sock.join(msg.id);
            sock.emit('hello', player);
            sock.emit('playerList', this.roomList[roomIdx].players.filter(playerItem => playerItem.id !== player.id))
        });

        sock.on('disconnect', () => {
            console.log(`User disconnected ${sock.id}`);
            const roomIdx = this.findRoomIdxByPlayer(sock.id);
            if (!roomIdx)
                return
            this.roomList[roomIdx].players = this.roomList[roomIdx].players.filter(player => player.id !== sock.id);
            const roomId = this.roomList[roomIdx].id;
            sock.to(`${roomId}`).emit('playerDisconnected', player.id);
        })
    }
}

module.exports = new App()