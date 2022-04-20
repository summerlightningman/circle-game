import {FC, useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {connect} from "socket.io-client";
import {URL} from "../../http";
import RoomPageStyled from "./room-page.styled";
import GameController from "../../game-controller";
import {Player, PlayerList} from "../../types/player";

const RoomPage: FC = () => {
    const [playerData, setPlayerData] = useState<Player>({id: '', name: 'NONE', color: 'transparent', x: 0, y: 0, radius: 0});
    const [playerList, setPlayerList] = useState<PlayerList>([]);
    const {id: roomId} = useParams();
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const sock = connect(URL);
        sock.emit('join', {id: roomId});
        sock.on('hello', player => setPlayerData(player));
        sock.on('world', console.log);
        sock.on('playerList', list => setPlayerList(list));
        sock.on('playerDisconnected', id => setPlayerList(playerList.filter(player => player.id !== id)));
        return () => {
            sock.disconnect()
        }
    }, []);


    let gameController: GameController;
    useEffect(() => {
        if (ref.current) {
            gameController = new GameController(ref.current, playerData, playerList);
            ref.current.addEventListener('keydown', gameController.handleKeyDown);
            ref.current.addEventListener('keyup', gameController.handleKeyUp);
        }
    });

    return (
        <RoomPageStyled>
            <canvas ref={ref} style={{width: '75vw', height: '90vh', marginTop: '5vh'}} tabIndex={0}></canvas>
        </RoomPageStyled>
    );
};

export default RoomPage;