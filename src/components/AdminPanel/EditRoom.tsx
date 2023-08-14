import { MdGroups } from "react-icons/md";
import { BiDotsHorizontalRounded, BiLink, BiEditAlt, BiLock, BiCommentX, BiTaskX, BiUserX, BiTrash } from "react-icons/bi";
import { NEGATIVE_TAB_IDX, NOT_FOUND_IDX, ReactDispatch, getToggleFunc } from "../../Utils";
import { Input } from "../Base/Input";
import { List } from "../Base/List/List";
import { ListItem } from "../Base/List/ListItems";
import "./EditRoom.css";
import { ChangeEventHandler, FC,  useEffect, useRef, useState } from "react";
import { Button, Divider, Tooltip } from "@mui/material";
import { MenuItemCheckbox, MenuItemWithIcon } from "../Menu/MenuItems";
import { Menu, MenuList } from "../Menu/Menu";
import { TextEditDialog } from "../Menu/TextEditDialog";

// TODO: Удалить после подключения NS Shared
export const enum VideoCodec
{
    VP9 = 'VP9',
    VP8 = 'VP8',
    H264 = 'H264'
}
export interface PublicRoomInfo
{
    id: string;
    name: string;
    videoCodec: VideoCodec;
}

interface RoomCardProps
{
    room : PublicRoomInfo
}
const RoomCard : FC<RoomCardProps> = ({room}) =>
{
    const btnRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [saveChat, setSaveChat] = useState<boolean>(false);
    const [symmetryMode, setSymmetryMode] = useState<boolean>(false);
    const [speakerMode, setSpeakerMode] = useState<boolean>(false);
    const [editNameVisible, setEditNameVisible] = useState<boolean>(false);

    const handleClose = () : void =>
    {
        setOpen(false);
    }

    const usersButton = 
        <Tooltip title="Список участников">
            <Button aria-label="Users list" tabIndex={-1}
                onClick={() => {console.log("users") }}>
                <MdGroups className="edit-room-list-item-icon" />
            </Button>
        </Tooltip>;

    return (
        <>
            <ListItem showSeparator={false} className="edit-room-list-item">
                {room.name}
                <div className="horizontal-expander" />
                {usersButton}
                <div ref={btnRef}>
                    <Button aria-label="Room settings" tabIndex={-1}
                        onClick={() => { setOpen(true) }}>
                        <BiDotsHorizontalRounded className="edit-room-list-item-icon" />
                    </Button>
                </div>
            </ListItem>
            <Menu
                anchorRef={btnRef}
                open={open}
                onClose={handleClose}
                transitionDuration={150}
                popperPlacement="bottom"
            >
                <MenuList open={open} >
                    <MenuItemWithIcon onClick={handleClose} endIcon={true} icon={<BiLink />} text="Получить ссылку на комнату" />
                    <MenuItemWithIcon onClick={getToggleFunc(setEditNameVisible)} endIcon={true} icon={<BiEditAlt />} text="Изменить название" />
                    <MenuItemWithIcon onClick={handleClose} endIcon={true} icon={<BiLock />} text="Изменить пароль" />
                    <Divider className="menu-divider" />
                    <MenuItemCheckbox text="Сохранение истории чата" onClick={getToggleFunc(setSaveChat)} isChecked={saveChat} />
                    <MenuItemCheckbox text="Симметричный режим" onClick={getToggleFunc(setSymmetryMode)} isChecked={symmetryMode} />
                    <MenuItemCheckbox text="Режим докладчика" onClick={getToggleFunc(setSpeakerMode)} isChecked={speakerMode} />
                    <Divider className="menu-divider" />
                    <MenuItemWithIcon onClick={handleClose} endIcon={true} icon={<BiCommentX />} text="Очистить историю чата" />
                    <MenuItemWithIcon onClick={handleClose} endIcon={true} icon={<BiTaskX />} text="Удалить все файлы комнаты" />
                    <MenuItemWithIcon onClick={handleClose} endIcon={true} icon={<BiUserX />} text="Кикнуть всех пользователей" />
                    <Divider className="menu-divider" />
                    <MenuItemWithIcon onClick={handleClose} endIcon={true} icon={<BiTrash className="delete-room-btn" />} text="Удалить комнату" />
                </MenuList>
            </Menu>
            <TextEditDialog isOpen={editNameVisible} label="Изменить имя комнаты" value={room.name} onClose={getToggleFunc(setEditNameVisible)} onValueConfirm={(val) => {console.log(val); setEditNameVisible(false)}} />
        </>
    )
}

interface RoomListProps
{
    filter? : string;
}

const RoomList : FC<RoomListProps> = ({filter}) =>
{
    const [roomsList, setRoomsList] = useState<PublicRoomInfo[]>([]);

    useEffect(() =>
    {
        const loadedRoomList: PublicRoomInfo[] = [
            { id: "G_OShinfHXD", name: "Главная", videoCodec: VideoCodec.H264 },
            { id: "NV6oozYIm2T", name: "Netrunners", videoCodec: VideoCodec.H264 },
            { id: "Jqd0wDUDONo", name: "edu", videoCodec: VideoCodec.H264 },
            { id: "Y3OG7r9Qh6s", name: "Статус МОС", videoCodec: VideoCodec.H264 },
            { id: "q61oq10dUu5", name: "g", videoCodec: VideoCodec.H264 },
            { id: "3tzcDFnVEWz", name: "infedu", videoCodec: VideoCodec.H264 },
            { id: "9KT5a-wPftO", name: "mos-research", videoCodec: VideoCodec.H264 },
            { id: "KjWPqLcbHRi", name: "mos-devel", videoCodec: VideoCodec.H264 },
            { id: "inSdz0nbvA4", name: "vp9", videoCodec: VideoCodec.H264 },
            { id: "_efhN2j8tp1", name: "Предприятие 3826", videoCodec: VideoCodec.H264 },
            { id: "meD6afojFJY", name: "fam", videoCodec: VideoCodec.H264 },
            { id: "zaogu1TOQmu", name: "cco", videoCodec: VideoCodec.H264 },
            { id: "OkpHvA4_FxH", name: "hh", videoCodec: VideoCodec.H264 },
            { id: "_N4fIk3RfAe", name: "forall", videoCodec: VideoCodec.H264 },
            { id: "uMxk3nLNQP5", name: "Clio", videoCodec: VideoCodec.H264 },
        ];

        setRoomsList(loadedRoomList);
    }, []);

    const roomNameFilter = (room : PublicRoomInfo) : boolean =>
    {
        if (filter === undefined)
        {
            return true;
        }
        return room.name.toLowerCase().indexOf(filter.toLowerCase()) > NOT_FOUND_IDX;
    }

    const createRoomCard = (room : PublicRoomInfo) : JSX.Element =>
    {
        return (
            <RoomCard key={room.id} room={room} />
        )
    }

    return (
        <div className="edit-room-list non-selectable" tabIndex={NEGATIVE_TAB_IDX}>
            <List>
                {roomsList.filter(roomNameFilter).map(createRoomCard)}
            </List>
        </div>
    )
}

interface SearchPanelProps
{
    filter: string;
    setFilter : ReactDispatch<string>;
}

const SearchPanel : FC<SearchPanelProps> = ({filter, setFilter}) =>
{
    const handleFilterChange : ChangeEventHandler<HTMLInputElement> = (ev) =>
    {
        setFilter(ev.target.value);
    }

    return (
        <div className="room-search-panel">
            <span className="room-search-label text-wrap non-selectable">
                Поиск
            </span>
            <Input value={filter} onChange={handleFilterChange}/>
        </div>
    );
}

export const EditRoom : FC = () =>
{
    const [filter, setFilter] = useState<string>("");

    return (
        <div className="room-edit-container">
            <SearchPanel filter={filter} setFilter={setFilter} />
            <RoomList filter={filter} />
        </div>
    );
}
