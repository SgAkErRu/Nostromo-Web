import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

import "../App.css";
import "./RoomListPage.css";
import { List } from "../components/Base/List/List";
import { LoadedRoomList, PublicRoomInfo } from "../services/RoomService";
import { RoomListItem } from "../components/Base/Room/RoomListItem";
import { NumericConstants as NC } from "../utils/NumericConstants";
import { SearchPanel } from "../components/Base/List/SearchPanel";
import { Tooltip } from "../components/Tooltip";
import { Button } from "@mui/material";
import { IoLogInOutline } from "react-icons/io5";

export const RoomListPage: React.FC = () =>
{
    const navigate = useNavigate();

    const [filter, setFilter] = useState<string>("");
    const [roomsList, setRoomsList] = useState<PublicRoomInfo[]>([]);
    useEffect(() =>
    {
        setRoomsList(LoadedRoomList);
    }, []);

    useEffect(() =>
    {
        document.title = "Nostromo - Список комнат";
    }, []);

    const createRoomItem = (room: PublicRoomInfo): JSX.Element =>
    {
        const handleRedirect = (): void =>
        {
            navigate(`/r/${room.id}`);
        };

        const openRoom =
            <Tooltip key="join-btn" title="Зайти в комнату">
                <Button className="room-list-button" aria-label="Open room" tabIndex={-1}
                    onClick={handleRedirect}>
                    <IoLogInOutline className="room-list-item-icon" />
                </Button>
            </Tooltip>;

        return (
            <RoomListItem key={room.id} onClick={handleRedirect} activateHandler={handleRedirect} room={room} action={openRoom} />
        );
    };
    const roomNameFilter = (room: PublicRoomInfo): boolean =>
    {
        return room.name.toLowerCase().indexOf(filter.toLowerCase()) > NC.NOT_FOUND_IDX;
    };
    return (
        <>
            <Header title="Список комнат" />
            <div id="main">
                <div className="room-list-area">
                    <SearchPanel className="room-list-search-panel" filter={filter} setFilter={setFilter} />
                    <div id="room-list" tabIndex={NC.NEGATIVE_TAB_IDX}>
                        <List>
                            {roomsList.filter(roomNameFilter).map(createRoomItem)}
                        </List>
                    </div>
                </div>
            </div>
        </>
    );
};
