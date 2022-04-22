import {FC, useEffect, useRef} from "react";
import {io} from "socket.io-client";
import {URL} from '../../http';
import Canvas from "./game-arena-styled";
import GameController from "../../game-controller";
import {GameArenaProps} from "./game-arena.types";

const socket = io(URL);

const GameArena: FC<GameArenaProps> = ({roomId}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {

        if (canvasRef.current) {
            const gameController = new GameController(socket, canvasRef.current, {roomId});
            canvasRef.current.addEventListener('keydown', gameController.handleKeyDown);
            canvasRef.current.addEventListener('keyup', gameController.handleKeyUp);
        }

        const leaveFromGame = () => {
            socket.emit('leave');
            socket.disconnect();
        }

        window.addEventListener('beforeunload', leaveFromGame);
        window.addEventListener('unload', leaveFromGame);
        return () => {
            window.addEventListener('beforeunload', leaveFromGame);
            window.addEventListener('unload', leaveFromGame);
        }
    }, [roomId]);


    return <Canvas tabIndex={0} ref={canvasRef}>
        You have to update your browser and/or enable JavaScript to see the game
    </Canvas>
}

export default GameArena