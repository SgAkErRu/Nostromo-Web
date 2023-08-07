import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Header } from "../components/Header";

import "../App.css";
import "./RoomListPage.css";
import { PublicRoomInfo } from "nostromo-shared/types/RoomTypes";
import { GeneralSocketServiceContext } from "../App";

export const RoomListPage: React.FC = () =>
{
    const [roomList, setRoomList] = useState<PublicRoomInfo[]>([]);
    const generalSocketService = useContext(GeneralSocketServiceContext);

    const roomListToMap = (room: PublicRoomInfo, index: number): JSX.Element =>
    {
        return (
            <NavLink to={`/r/${room.id}`} id={room.id} className="room-list-item">
                <span className="room-list-item-label">{room.name}</span>
                <span className="room-list-item-id">#{room.id}</span>
                <span className="room-list-item-join">Войти</span>
            </NavLink>
        );
    };

    useEffect(() =>
    {
        document.title = "Nostromo - Список комнат";
    }, []);

    useEffect(() =>
    {
        generalSocketService.subscribeOnRoomList(setRoomList);

        return () =>
        {
            generalSocketService.unsubscribeOnRoomList();
        };
    }, [generalSocketService]);

    return (
        <>
            <Header title="Список комнат" />
            <div id="main">
                <div id="room-list">
                    {roomList.length ? roomList.map(roomListToMap) : "Комнаты отсутствуют на сервере"}
                </div>
            </div>
        </>
    );
};