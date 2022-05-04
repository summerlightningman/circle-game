import {Coord, Player, PlayerColor, PlayerID, PlayerList} from "./types/player";
import {RoomID} from "./types/room";
import {Socket} from "socket.io-client";

interface PlayerData {
    roomId: RoomID
}

interface MoveData {
    id: PlayerID,
    coords: {
        x: Coord,
        y: Coord
    }
}

class GameController {
    ctx: CanvasRenderingContext2D;
    playerList: PlayerList;
    player: Player;

    width: number;
    height: number;
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
            y: 10,
            activeKeys: {
                up: false,
                down: false,
                left: false,
                right: false
            }
        };

        canvas.width = this.width = canvas.clientWidth;
        canvas.height = this.height = canvas.clientHeight;


        this.socket = socket;
        this.socket.on('connect', () => {
            this.socket.emit('join', data);
        })
        this.socket.on('hello', player => this.player = {...player});
        this.socket.on('playerList', this.setPlayerList);
        this.socket.on('joined', this.addPlayerToList);
        this.socket.on('left', this.removePlayerFromList);
        this.socket.on('movement', this.handleMoveData);

        this.setTextParameters();
        this.runGameCycle(() => this.socket.emit('join', data));
    }

    handleMoveData = (data: MoveData) => {
        console.log(data);
        if (data.id === this.player.id) {
            this.player.x = data.coords.x;
            this.player.y = data.coords.y;
            return
        }

        this.playerList = this.playerList.reduce(
            (players: PlayerList, player: Player) => player.id === data.id
                ? [...players, {...player, x: data.coords.x, y: data.coords.y}]
                : [...players, player]
        , []);
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
        let key: string;
        switch (e.key) {
            case 'ArrowLeft':
                key = 'left';
                break;
            case 'ArrowRight':
                key = 'right';
                break;
            case 'ArrowUp':
                key = 'up';
                break;
            case 'ArrowDown':
                key = 'down';
                break;
            default:
                return
        }
        // @ts-ignore
        if (this.player.activeKeys[key] === true)
            return
        // @ts-ignore
        this.player.activeKeys[key] = true;
        return this.socket.emit('keydown', {key})
    }

    handleKeyUp = (e: KeyboardEvent) => {
        let key: string;
        switch (e.key) {
            case 'ArrowLeft':
                key = 'left';
                break
            case 'ArrowRight':
                key = 'right';
                break
            case 'ArrowUp':
                key = 'up';
                break
            case 'ArrowDown':
                key = 'down'
                break;
            default:
                return
        }
        // @ts-ignore
        if (this.player.activeKeys[key] === false)
            return
        // @ts-ignore
        this.player.activeKeys[key] = false;
        this.socket.emit('keyup', {key})
    }

    private runGameCycle = (rejoin: () => void) => {
        const interval = setInterval(() => {
            if (this.player.name === 'undefined') {
                rejoin();
            }
            this.drawBackground();
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
        this.ctx.fillRect(0, 0, this.width, this.height);
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