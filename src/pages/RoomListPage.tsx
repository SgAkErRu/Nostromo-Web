import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Header } from "../components/Header";

import "../App.css";
import "./RoomListPage.css";
import { PublicRoomInfo } from "nostromo-shared/types/RoomTypes";
import { GeneralSocketServiceContext } from "../AppWrapper";

export const RoomListPage: React.FC = () =>
{
    const [isRequestDone, setIsRequestDone] = useState<boolean>(false);
    const [roomList, setRoomList] = useState<PublicRoomInfo[]>([]);
    const generalSocketService = useContext(GeneralSocketServiceContext);

    const roomListToMap = (room: PublicRoomInfo, index: number): JSX.Element =>
    {
        return (
            <NavLink to={`/r/${room.id}`}
                id={room.id}
                className="room-list-item"
                key={room.id}
            >
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
        generalSocketService.subscribeOnRoomList(setIsRequestDone, setRoomList);

        return () =>
        {
            generalSocketService.unsubscribeOnRoomList();
        };
    }, [generalSocketService]);

    return (
        <>
            <Header title="Список комнат" />
            <div id="main">
                {/** TODO: задействовать компонент List. */}
                <div id="room-list">
                    {roomList.length
                        ? roomList.map(roomListToMap)
                        : <p className="flex-centered">
                            {!isRequestDone ? "Ожидание ответа от сервера..." : "Комнаты отсутствуют на сервере"}
                        </p>}
                </div>
            </div>
        </>
    );
};
