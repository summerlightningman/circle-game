import {FC, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {connect} from "socket.io-client";
import {URL} from "../../http";
import RoomPageStyled from "./room-page.styled";

const sock = connect(URL);

const RoomPage: FC = () => {
    const [name, setName] = useState('');
    const {id} = useParams();

    useEffect(() => {
        sock.on('hello', user => {
            setName(user.name);
        });
        return () => {
            sock.disconnect()
        }
    }, []);

    return (
        <RoomPageStyled>
            Room id = {id} <br/>
            So your name = {name}
        </RoomPageStyled>
    );
};

export default RoomPage;