import {FC} from 'react';
import {RoomListItemProps} from "./room-list-item.types";
import RoomListItemStyled from "./room-list-item.styled";
import RoomName from "../styled/room-name";

const RoomListItem: FC<RoomListItemProps> = ({name}) => {
    return (
        <RoomListItemStyled>
            <RoomName>{name}</RoomName>

        </RoomListItemStyled>
    );
};

export default RoomListItem;