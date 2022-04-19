import {FC} from 'react';
import GlobalStyle from "../styled/global-style";
import RoomList from "../room-list/room-list";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import AppStyled from "./app.styled";
import RoomPage from "../room-page/room-page";

const App: FC = () => {
    return (
        <>
            <GlobalStyle/>
            <AppStyled>
                <BrowserRouter>
                    <Routes>
                        <Route element={<RoomList/>} path="/"/>
                        <Route element={<RoomPage/>} path="/room/:id"/>
                    </Routes>
                </BrowserRouter>

            </AppStyled>
        </>
    )
        ;
}

export default App;
