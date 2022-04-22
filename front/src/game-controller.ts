import {Player, PlayerColor, PlayerID, PlayerList} from "./types/player";
import {RoomID} from "./types/room";
import {Socket} from "socket.io-client";

interface PlayerData {
    roomId: RoomID
}

class GameController {
    ctx: CanvasRenderingContext2D;
    playerList: PlayerList;
    player: Player;

    width: number;
    height: number;
    dPlayerX: number;
    dPlayerY: number;

    socket: Socket;


    constructor(socket: Socket, canvas: HTMLCanvasElement, data: PlayerData) {
        this.ctx = canvas.getContext('2d')!;
        this.playerList = [];
        this.player = {
            id: '-1',
            name: 'undefined',
            color: 'rgb(0, 0, 0)',
            radius: 10,
            x: 10,
            y: 10
        };
        this.dPlayerX = this.dPlayerY = 0;

        canvas.width = this.width = canvas.offsetWidth;
        canvas.height = this.height = canvas.offsetHeight;


        this.socket = socket;
        this.socket.on('connect', () => {
            this.socket.emit('join', data);
        })
        this.socket.on('hello', player => this.player = player);
        this.socket.on('playerList', this.setPlayerList);
        this.socket.on('playerConnected', this.addPlayerToList);
        this.socket.on('left', this.removePlayerFromList);

        this.setTextParameters();
        this.runGameCycle(() => this.socket.emit('join', data));
    }

    setPlayerList = (list: PlayerList) => {
        this.playerList = list;
    }

    addPlayerToList = (player: Player) => {
        this.setPlayerList([...this.playerList, player]);
    }

    removePlayerFromList = (playerId: PlayerID) => {
        this.setPlayerList(this.playerList.filter(_ => _.id !== playerId));
    };


    handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowLeft':
                if (this.player.x - this.player.radius > 0)
                    return this.dPlayerX = -4;
                return this.dPlayerX = 0
            case 'ArrowRight':
                if (this.player.x + this.player.radius < this.width)
                    return this.dPlayerX = 4;
                return this.dPlayerX = 0
            case 'ArrowUp':
                if (this.player.y - this.player.radius > 0)
                    return this.dPlayerY = -4;
                return this.dPlayerY = 0
            case 'ArrowDown':
                if (this.player.y + this.player.radius < this.height)
                    return this.dPlayerY = 4
                return this.dPlayerY = 0
        }
    }

    handleKeyUp = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                this.dPlayerX = 0;
                return
            case 'ArrowUp':
            case 'ArrowDown':
                this.dPlayerY = 0
                return
        }
    }

    private runGameCycle = (rejoin: () => void) => {
        const interval = setInterval(() => {
            if (this.player.name === 'undefined') {
                rejoin();
            }
            this.drawBackground();
            this.player.x += this.dPlayerX;
            this.player.y += this.dPlayerY;
            this.playerList.forEach(this.drawPlayer);
            this.drawPlayer(this.player);
        }, 10);
        this.runGameCycle = () => {
            clearInterval(interval);
            return this.runGameCycle(rejoin)
        }
    };

    private setTextParameters = () => {
        this.ctx.font = 'normal 32px Arial';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
    }

    private drawBackground = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = '#DFCFBE';
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    static reverseColor = (color: PlayerColor): PlayerColor => {
        const result = color.match(/rgb\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)/);
        if (!result)
            return color
        const [, r, g, b] = result
        return `rgb(${255 - +r}, ${255 - +g}, ${255 - +b})`
    }

    private drawPlayer = (player: Player) => {
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = player.color;
        this.ctx.fill();
        this.ctx.fillStyle = GameController.reverseColor(player.color);
        this.ctx.fillText(player.name, player.x, player.y);
        if (this.player.name === player.name) {
            this.ctx.strokeStyle = GameController.reverseColor(this.player.color);
            this.ctx.stroke();
        }
        this.ctx.closePath();
    }


}

export default GameController