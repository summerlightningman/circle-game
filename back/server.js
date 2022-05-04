const express = require('express');
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');

const App = require('./app.js');

const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.get('/rooms', App.listRooms);

io.on('connection', App.onSocketConnection(io));

server.listen(port, () => console.log('Server was started at PORT ' + port));
