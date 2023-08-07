import { io, Socket } from "socket.io-client";

//TODO: настроить webpack вручную, чтобы не жаловался на импорт enum
import { SocketEvents as SE } from "nostromo-shared/types/SocketEvents";
import { PublicRoomInfo } from "nostromo-shared/types/RoomTypes";
import { RoomNameInfo } from "nostromo-shared/types/AdminTypes";
import { ReactDispatch } from "../Utils";

// Класс для работы с сокетами на главной странице
export default class GeneralSocketService
{
    private readonly m_socket: Socket = io("/", {
        'transports': ['websocket']
    });

    public constructor()
    {
        console.debug("GeneralSocketService ctor");

        this.m_socket.on('connect', () =>
        {
            console.debug("Создано подключение веб-сокета: ", this.m_socket.id);
        });

        this.m_socket.on('connect_error', (err: Error) =>
        {
            console.error(err.message);
        });

        this.m_socket.on(SE.Disconnect, () => { this.handleDisconnect(); });
    }

    public subscribeOnRoomList(setList: ReactDispatch<PublicRoomInfo[]>): void
    {
        // Запросим список комнат.
        this.m_socket.emit(SE.RoomList);

        this.m_socket.once(SE.RoomList, (rooms: PublicRoomInfo[]) => { setList(rooms); });

        this.m_socket.on(SE.RoomCreated, (room: PublicRoomInfo) => { setList(prev => [...prev, room]); });

        this.m_socket.on(SE.RoomDeleted, (id: string) =>
        {
            setList(prev => prev.filter(r => r.id !== id));
        });

        this.m_socket.on(SE.RoomNameChanged, (info: RoomNameInfo) =>
        {
            setList((prev) =>
            {
                const idx = prev.findIndex(r => r.id === info.id);
                prev[idx].name = info.name;
                return prev;
            });
        });
    }

    public unsubscribeOnRoomList(): void
    {
        this.m_socket.off(SE.RoomList);
        this.m_socket.off(SE.RoomCreated);
        this.m_socket.off(SE.RoomDeleted);
        this.m_socket.off(SE.RoomNameChanged);
    }

    private handleDisconnect(): void
    {
        console.warn("Вы были отсоединены от веб-сервера (websocket disconnect).");
    }
}