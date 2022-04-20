import {Player, PlayerColor, PlayerList} from "./types/player";

class GameController {
    ctx: CanvasRenderingContext2D;
    player: Player;
    playerList: PlayerList;

    width: number;
    height: number;
    dPlayerX: number;
    dPlayerY: number;

    constructor(canv: HTMLCanvasElement, player: Player, playerList: PlayerList) {
        this.ctx = canv.getContext('2d')!;
        this.player = player;
        this.playerList = playerList;

        this.dPlayerX = this.dPlayerY = 0;

        canv.width = this.width = canv.offsetWidth;
        canv.height = this.height = canv.offsetHeight;

        console.log(playerList);

        this.setTextParameters();
        this.runGameCycle();
    }

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

    private runGameCycle = () => setInterval(() => {
        this.drawBackground();
        this.player.x += this.dPlayerX;
        this.player.y += this.dPlayerY;
        this.drawPlayer(this.player);
        this.playerList.forEach(this.drawPlayer);
    }, 10);

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

    drawPlayer = (player: Player) => {
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = player.color;
        this.ctx.fill();
        this.ctx.fillStyle = GameController.reverseColor(this.player.color);
        this.ctx.fillText(player.name, player.x, player.y);
        if (this.player.name === player.name) {
            this.ctx.strokeStyle = GameController.reverseColor(this.player.color);
            this.ctx.stroke();
        }
        this.ctx.closePath();
    }
}

export default GameController