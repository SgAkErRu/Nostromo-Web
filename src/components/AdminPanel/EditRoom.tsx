import { MdGroups } from "react-icons/md";
import { BiDotsHorizontalRounded, BiLink, BiEditAlt, BiLock, BiCommentX, BiTaskX, BiUserX, BiTrash } from "react-icons/bi";
import { MOUSE_EVENT_NONE_BTN, NEGATIVE_TAB_IDX, NOT_FOUND_IDX, ReactDispatch, getToggleFunc } from "../../Utils";
import { List } from "../Base/List/List";
import "./EditRoom.css";
import { FC, MouseEventHandler,  useEffect, useRef, useState } from "react";
import { Button, Divider, Tooltip } from "@mui/material";
import { MenuItemCheckbox, MenuItemWithIcon } from "../Menu/MenuItems";
import { AnchorPosition, Menu, MenuList } from "../Menu/Menu";
import { TextEditDialog } from "../Menu/TextEditDialog";
import { EditUser } from "./EditUser";
import { SearchPanel } from "../Base/List/SearchPanel";
import { RoomListItem } from "../Base/Room/RoomListItem";
import { LoadedRoomList, PublicRoomInfo } from "../../services/RoomService";

interface RoomCardProps
{
    room : PublicRoomInfo;
    setIdRoom: ReactDispatch<string>;
}
const RoomCard : FC<RoomCardProps> = ({room, setIdRoom }) =>
{
    const focusBackRef = useRef<HTMLElement | null>(null);
    const btnRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<AnchorPosition | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [saveChat, setSaveChat] = useState<boolean>(false);
    const [symmetryMode, setSymmetryMode] = useState<boolean>(false);
    const [speakerMode, setSpeakerMode] = useState<boolean>(false);
    const [editNameVisible, setEditNameVisible] = useState<boolean>(false);
    const [editPasswordVisible, setEditPasswordVisible] = useState<boolean>(false);

    const handleClose = () : void =>
    {
        setOpen(false);
    }

    /* Обработчики для смены названия комнаты */
    const handleRoomNameEdit = () : void =>
    {
        setEditNameVisible(true);
        handleClose();
    }

    const handleNameChangeCancel = () : void =>
    {
        focusBackRef.current?.focus();
        setEditNameVisible(false);
    }

    const handleNameChangeConfirm = (val : string) : void =>
    {
        focusBackRef.current?.focus();
        setEditNameVisible(false);
    }

    /* Обработчики для смены пароля комнаты */
    // TODO: в TextDialog по смене пароля, пароль принимает значения ID, так как
    //       пока что пароль нигде не хранится
    const handleRoomPasswordEdit = () : void =>
    {
        setEditPasswordVisible(true);
        handleClose();
    }

    const handlePasswordChangeCancel = () : void =>
    {
        focusBackRef.current?.focus();
        setEditPasswordVisible(false);
    }

    const handlePasswordChangeConfirm = (val : string) : void =>
    {
        focusBackRef.current?.focus();
        setEditPasswordVisible(false);
    }

    /* TODO: Реализовать тестовые обработчики для контекстного меню */
    const handleCopyRoomLink = () : void =>
    {
        console.log("Ссылка комнаты: ", room.id);
    }

    const handleClearHistoryChat = () : void =>
    {
        console.log("Очистить историю комнаты: ", room.id);
    }

    const handleKickAllUsers = () : void =>
    {
        console.log("Кикнуть всех пользователей из комнаты ", room.id);
    }

    const handleRemoveFiles = () : void =>
    {
        console.log("Удалить все файлы из комнаты ", room.id);
    }

    const handleDeleteRoom = () : void =>
    {
        console.log("Удалить комнату ", room.id);
    }
    /*---------------*/

    const handleContextMenuShow : MouseEventHandler = (ev) : void =>
    {
        ev.preventDefault();
        if (ev.button === MOUSE_EVENT_NONE_BTN && btnRef.current)
        {
            setMenuPosition(null);
        }
        else
        {
            setMenuPosition({ left: ev.clientX, top: ev.clientY });
        }
        focusBackRef.current = document.activeElement as HTMLElement;
        setOpen(true);
    }

    const handleRoomSelected : MouseEventHandler = () : void =>
    {
        setIdRoom(room.id);
    }

    const renameRoomDescription = <>Введите новое имя для комнаты <strong>"{room.name}"</strong>.</>
    const changePasswordRoomDescription = <>Введите новый пароль для комнаты <strong>"{room.name}"</strong>.</>

    const usersButton = 
        <Tooltip title="Список участников">
            <Button aria-label="Users list" tabIndex={-1}
                onClick={handleRoomSelected}>
                <MdGroups className="edit-room-list-item-icon" />
            </Button>
        </Tooltip>;

    const contextMenuButton =
        <Tooltip ref={btnRef} className="edit-room-open-context-btn" title="Список участников">
            <Button aria-label="Room settings" tabIndex={-1}
                onClick={handleContextMenuShow}>
                <BiDotsHorizontalRounded className="edit-room-list-item-icon" />
            </Button>
        </Tooltip>
    
    return (
        <>
            <RoomListItem
                room={room}
                contextMenuHandler={handleContextMenuShow}
                actions={[usersButton, contextMenuButton]}
            />
            <Menu
                anchorPosition={menuPosition ?? undefined}
                anchorRef={btnRef}
                open={open}
                onClose={handleClose}
                transitionDuration={150}
                popperPlacement="bottom"
            >
                <MenuList open={open} >
                    <MenuItemWithIcon onClick={handleCopyRoomLink} endIcon={true} icon={<BiLink />} text="Получить ссылку на комнату" />
                    <MenuItemWithIcon onClick={handleRoomNameEdit} endIcon={true} icon={<BiEditAlt />} text="Изменить название" />
                    <MenuItemWithIcon onClick={handleRoomPasswordEdit} endIcon={true} icon={<BiLock />} text="Изменить пароль" />
                    <Divider className="menu-divider" />
                    <MenuItemCheckbox text="Сохранение истории чата" onClick={getToggleFunc(setSaveChat)} isChecked={saveChat} />
                    <MenuItemCheckbox text="Симметричный режим" onClick={getToggleFunc(setSymmetryMode)} isChecked={symmetryMode} />
                    <MenuItemCheckbox text="Режим докладчика" onClick={getToggleFunc(setSpeakerMode)} isChecked={speakerMode} />
                    <Divider className="menu-divider" />
                    <MenuItemWithIcon onClick={handleClearHistoryChat} endIcon={true} icon={<BiCommentX />} text="Очистить историю чата" />
                    <MenuItemWithIcon onClick={handleRemoveFiles} endIcon={true} icon={<BiTaskX />} text="Удалить все файлы комнаты" />
                    <MenuItemWithIcon onClick={handleKickAllUsers} endIcon={true} icon={<BiUserX />} text="Кикнуть всех пользователей" />
                    <Divider className="menu-divider" />
                    <MenuItemWithIcon onClick={handleDeleteRoom} endIcon={true} icon={<BiTrash className="delete-room-btn" />} text="Удалить комнату" />
                </MenuList>
            </Menu>
            <TextEditDialog isOpen={editNameVisible} label="Изменить имя комнаты" description={renameRoomDescription} value={room.name} onClose={handleNameChangeCancel} onValueConfirm={handleNameChangeConfirm} />
            <TextEditDialog isOpen={editPasswordVisible} label="Изменить пароль от комнаты" description={changePasswordRoomDescription} value={room.id} onClose={handlePasswordChangeCancel} onValueConfirm={handlePasswordChangeConfirm} />
        </>
    )
}

interface RoomListProps
{
    filter? : string;
    setIdRoom: ReactDispatch<string>;
}

const RoomList : FC<RoomListProps> = ({ filter, setIdRoom }) =>
{
    const [roomsList, setRoomsList] = useState<PublicRoomInfo[]>([]);

    useEffect(() =>
    {
        setRoomsList(LoadedRoomList);
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
            <RoomCard setIdRoom={setIdRoom} key={room.id} room={room} />
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

export const EditRoom : FC = () =>
{
    const [filter, setFilter] = useState<string>("");
    const [idRoom, setIdRoom] = useState<string>("");
    return (
        <>
        {idRoom !== ""? 
            <EditUser roomID={idRoom} setIdRoom={setIdRoom} />
        :
            <div className="room-edit-container">
                <SearchPanel filter={filter} setFilter={setFilter} />
                <RoomList setIdRoom={setIdRoom} filter={filter} />
            </div>
        }
        </>
    );
}
