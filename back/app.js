class App {
    constructor() {
        this.roomList = {
            'gdfgdv': {name: 'First', players: []},
            '23rfds': {name: 'Second', players: []},
            'bvssd': {name: 'Third', players: []}
        }

        this.names = require('./db.js');
    }

    listRooms = (req, res) => {
        res.type('application/json');

        const roomInfos = Object.entries(this.roomList)
            .map(([roomId, {name, players}]) => ({id: roomId, name, userCount: players.length}));
        return res.json(roomInfos);
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

    findRoomIdByPlayerId = id => Object.keys(this.roomList)
        .find(roomId => this.roomList[roomId].players.some(player => player.id === id));

    onSocketConnection = sock => {
        const player = {
            id: sock.id,
            name: this.getRandomName(),
            color: this.getRandomColor(),
            radius: this.getRandomNumber(50, 75),
            x: this.getRandomNumber(250, 500),
            y: this.getRandomNumber(300, 600)
        };

        console.log(`%cUser ${sock.id}:${player.name} was connected`, `color: ${player.color}`);

        sock.on('join', msg => {
            this.roomList[msg.roomId].players.push(player);

            sock.in(msg.roomId).emit('playerConnected', player);
            sock.join(msg.roomId);
            sock.emit('hello', player);
            sock.emit('playerList', this.roomList[msg.roomId].players.filter(_ => _.id !== player.id));
        });

        const kickUser = () => {
            console.log(`User ${sock.id} was disconnected`);
            const roomId = this.findRoomIdByPlayerId(sock.id);

            sock.in(roomId).emit('left', player.id);
            if (!roomId)
                return
            this.roomList[roomId].players = this.roomList[roomId].players.filter(player => player.id !== sock.id);
        };

        sock.on('disconnect', kickUser);
        sock.on('leave', kickUser);

        sock.on('connect_error', () => {
            console.log(sock.id, 'ОШИБОЧКА ВЫШЛА');
        })
    }
}

module.exports = new App()