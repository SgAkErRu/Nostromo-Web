import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

import "../App.css";
import "./RoomListPage.css";
import { List } from "../components/Base/List/List";
import { LoadedRoomList, PublicRoomInfo } from "../services/RoomService";
import { RoomListItem } from "../components/Base/Room/RoomListItem";
import { NEGATIVE_TAB_IDX } from "../Utils";

export const RoomListPage: React.FC = () =>
{
    const navigate = useNavigate();

    const [roomsList, setRoomsList] = useState<PublicRoomInfo[]>([]);
    useEffect(() =>
    {
        setRoomsList(LoadedRoomList);
    }, []);

    useEffect(() =>
    {
        document.title = "Nostromo - Список комнат";
    }, []);

    const createRoomItem = (room : PublicRoomInfo) : JSX.Element =>
    {
        const handleRedirect = () : void =>
        {
            navigate(`/r/${room.id}`);
        }
        
        return (
            <RoomListItem onClick={handleRedirect} activateHandler={handleRedirect} room={room} />
        )
    } 

    return (
        <>
            <Header title="Список комнат" />
            <div id="main">
                <div id="room-list" tabIndex={NEGATIVE_TAB_IDX}>
                    <List>
                        {roomsList.map(createRoomItem)}
                    </List>
                </div>
            </div>
        </>
    );
};
