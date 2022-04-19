import {FC} from 'react';
import GlobalStyle from "../styled/global-style";
import RoomList from "../room-list/room-list";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import AppStyled from "./app.styled";

const App: FC = () => {
    return (
        <>
            <GlobalStyle/>
            <AppStyled>
                <BrowserRouter>
                    <Routes>
                        <Route element={<RoomList/>} path="/"/>
                    </Routes>
                </BrowserRouter>

            </AppStyled>
        </>
    )
        ;
}

export default App;
