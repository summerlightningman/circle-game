import {FC} from 'react';
import {useParams} from "react-router-dom";

const RoomPage: FC = () => {
    const {id} = useParams();

    return (
        <div>
            Room id = {id}
        </div>
    );
};

export default RoomPage;