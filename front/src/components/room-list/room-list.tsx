import {FC, useEffect, useState} from 'react';
import RoomListStyled from "./room-list.styled";
import RoomListItem from "../room-list-item/room-list-item";
import {RoomList as RoomListType} from "../../types/room";
import {getRoomList} from "../../http";

const RoomList: FC = () => {
    const [roomList, setRoomList] = useState<RoomListType>([]);
    
    useEffect(() => {
        getRoomList()
            .then(setRoomList);
    }, []);

    return (
        <RoomListStyled>
            {roomList.map(room => <RoomListItem {...room} key={`${room.id}-${room.name}-${room.count}`}/>)}
        </RoomListStyled>
    );
};

export default RoomList;