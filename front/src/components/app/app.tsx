import {FC} from 'react';
import GlobalStyle from "../styled/global-style";
import RoomList from "../room-list/room-list";
import AppStyled from "./app.styled";

const App: FC = () => {
    return (
        <>
            <GlobalStyle/>
            <AppStyled>
                <RoomList/>
            </AppStyled>
        </>
    );
}

export default App;
