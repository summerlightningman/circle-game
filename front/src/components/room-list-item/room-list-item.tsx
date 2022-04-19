import {FC} from 'react';
import {RoomListItemProps} from "./room-list-item.types";
import RoomListItemStyled from "./room-list-item.styled";
import RoomName from "../styled/room-name";
import {useNavigate} from "react-router-dom";

const RoomListItem: FC<RoomListItemProps> = ({id, name}) => {
    const navigate = useNavigate();

    const goToRoom = () => navigate(`/room/${id}`);

    return (
        <RoomListItemStyled onClick={goToRoom}>
            <RoomName>{name}</RoomName>
        </RoomListItemStyled>
    );
};

export default RoomListItem;