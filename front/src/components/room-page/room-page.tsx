import {FC, useMemo} from 'react';
import {useParams} from "react-router-dom";
import {connect} from "socket.io-client";
import {URL} from "../../http";
import RoomPageStyled from "./room-page.styled";

const RoomPage: FC = () => {
    const {id} = useParams();

    const sock = useMemo(() => {
        return connect(URL)
    }, []);

    sock.on('hello', console.log);

    return (
        <RoomPageStyled>
            Room id = {id}
        </RoomPageStyled>
    );
};

export default RoomPage;