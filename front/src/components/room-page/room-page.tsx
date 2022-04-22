import {FC} from 'react';
import {useParams} from "react-router-dom";
import RoomPageStyled from "./room-page.styled";
import GameArena from "../game-arena/game-arena";


const RoomPage: FC = () => {
    const {id: roomId} = useParams();

    if (!roomId)
        return <h1>Room not found</h1>

    return (
        <RoomPageStyled>
            <GameArena roomId={roomId}/>
        </RoomPageStyled>
    );
};

export default RoomPage;