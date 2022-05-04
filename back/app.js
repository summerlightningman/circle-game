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

    onSocketConnection = io => sock => {
        const player = {
            id: sock.id,
            name: this.getRandomName(),
            color: this.getRandomColor(),
            radius: this.getRandomNumber(50, 75),
            x: this.getRandomNumber(250, 500),
            y: this.getRandomNumber(300, 600),
            activeKeys: {
                up: false,
                down: false,
                left: false,
                right: false
            },
            roomId: ''
        };

        console.log(`%cUser ${sock.id}:${player.name} was connected`, `color: ${player.color}`);

        sock.on('join', msg => {
            this.roomList[msg.roomId].players.push(player);
            player.roomId = msg.roomId;

            sock.in(player.roomId).emit('joined', player);
            sock.join(player.roomId);
            sock.emit('hello', player);
            sock.emit('playerList', this.roomList[msg.roomId].players.filter(_ => _.id !== player.id));
        });

        sock.on('keydown', ({key}) => {
            if (key in player.activeKeys)
                player.activeKeys[key] = true;
        });

        sock.on('keyup', ({key}) => {
            if (key in player.activeKeys)
                player.activeKeys[key] = false;
        });

        const dx = 10;
        const dy = 10;

        const gameCycle = setInterval(() => {
            if (!Object.values(player.activeKeys).some(_ => _))
                return

            if (player.activeKeys.up)
                player.y -= dy;
            if (player.activeKeys.down)
                player.y += dy;
            if (player.activeKeys.left)
                player.x -= dx;
            if (player.activeKeys.right)
                player.x += dx;

            io.emit('movement', {id: player.id, coords: {x: player.x, y: player.y}});
        }, 10);

        const kickUser = () => {
            console.log(`User ${sock.id} was disconnected`);

            sock.in(player.roomId).emit('left', player.id);
            clearInterval(gameCycle);
            if (!player.roomId)
                return
            this.roomList[player.roomId].players = this.roomList[player.roomId].players.filter(player => player.id !== sock.id);
        };

        sock.on('disconnect', kickUser);
        sock.on('leave', kickUser);

        sock.on('connect_error', () => {
            console.log(sock.id, 'ОШИБОЧКА ВЫШЛА');
        })
    }
}

module.exports = new App()