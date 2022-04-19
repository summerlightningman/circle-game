class App {
    constructor() {
        this.roomList = [
            {id: 1, name: 'First', users: []},
            {id: 2, name: 'Second', users: []},
            {id: 3, name: 'Third', users: []},
        ]
    }

    helloWorld = (req, res) => {
        res.type('text/html');
        return res.send('<h1>Hello world!</h1>');
    }

    listRooms = (req, res) => {
        res.type('application/json');
        const roomInfos = this.roomList.map(room => ({id: room.id, name: room.name, userCount: room.users.length}));
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