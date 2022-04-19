class App {
    constructor() {
        this.roomList = [
            {name: 'First', users: []},
            {name: 'Second', users: []},
            {name: 'Third', users: []},
        ]
    }

    helloWorld = (req, res) => {
        res.type('text/html');
        return res.send('<h1>Hello world!</h1>');
    }

    listRooms = (req, res) => {
        res.type('application/json');
        const roomInfos = this.roomList.map(room => ({name: room.name, userCount: room.users.length}));
        return res.json(roomInfos);
    }

    onSocketConnection = sock => {
        console.log(`User connected ${sock.id}`);
        sock.emit('hello',`Пашол-ка ты нахуй со своим ${sock.id}`)

        sock.on('disconnect', () => {
            console.log(`User disconnected ${sock.id}`);
            sock.emit(`User disconnected ${sock.id}`)
        })
    }
}

module.exports = new App()