import { FC, MouseEventHandler, useEffect, useRef, useState } from "react";

import { Avatar, Button, Divider } from "@mui/material";
import { UserInfo } from "nostromo-shared/types/RoomTypes";
import { BiBlock, BiDotsHorizontalRounded, BiEditAlt, BiMicrophoneOff, BiUserX, BiVideoOff } from "react-icons/bi";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";
import { LoadedRoomList, PublicRoomInfo } from "../../../services/RoomService";
import { NumericConstants as NC } from "../../../utils/NumericConstants";
import { ReactDispatch, getToggleFunc } from "../../../utils/Utils";
import { List } from "../../Base/List/List";
import { ListItem } from "../../Base/List/ListItems";
import { SearchPanel } from "../../Base/List/SearchPanel";
import { TextEditDialog } from "../../Dialog/TextEditDialog";
import { AnchorPosition, Menu, MenuList } from "../../Menu/Menu";
import { MenuItemCheckbox, MenuItemWithIcon } from "../../Menu/MenuItems";
import { Tooltip } from "../../Tooltip";

import "./ManageUsers.css";

interface UserCardProps
{
    user: UserInfo;
}
const UserCard: FC<UserCardProps> = ({ user }) =>
{
    const focusBackRef = useRef<HTMLElement | null>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const [menuPosition, setMenuPosition] = useState<AnchorPosition | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [allowPerform, setAllowPerform] = useState<boolean>(false);
    const [editNameVisible, setEditNameVisible] = useState<boolean>(false);

    const handleClose = (): void =>
    {
        setOpen(false);
    };
    // TODO: Реализовать обработчики
    const handleKickUser: MouseEventHandler = (): void =>
    {
        console.log("Пользователь ", user.id, " кикнут");
    };
    const handleBanUser: MouseEventHandler = (): void =>
    {
        console.log("Пользователь ", user.id, " забанен");
    };
    const handleStopDemo: MouseEventHandler = (): void =>
    {
        console.log("Запретить демонстрацию экрана пользователю ", user.id);
    };
    const handleOffVideo: MouseEventHandler = (): void =>
    {
        console.log("Отключить видео пользователя ", user.id);
    };
    const handleOffAudio: MouseEventHandler = (): void =>
    {
        console.log("Отключить аудио пользователя ", user.id);
    };

    const handleContextMenuShow: MouseEventHandler = (ev): void =>
    {
        ev.preventDefault();
        if (ev.button === NC.MOUSE_EVENT_NONE_BTN && btnRef.current)
        {
            setMenuPosition(null);
        }
        else
        {
            setMenuPosition({ left: ev.clientX, top: ev.clientY });
        }
        focusBackRef.current = document.activeElement as HTMLElement;
        setOpen(true);
    };
    const handleUserNameEdit = (): void =>
    {
        setEditNameVisible(true);
        handleClose();
    };
    const handleNameChangeCancel = (): void =>
    {
        focusBackRef.current?.focus();
        setEditNameVisible(false);
    };

    const handleNameChangeConfirm = (val: string): void =>
    {
        focusBackRef.current?.focus();
        setEditNameVisible(false);
    };

    const renameUserDescription = <>Введите новый ник пользователя <label className="bold">"{user.name}"</label>.</>;

    const usersInfo =
        <>
            <div className="edit-user-avatar-container">
                <Avatar className="edit-user-avatar" children={user.name[NC.ZERO_IDX]} />
            </div>
            <div className="edit-user-info">
                <Tooltip title="Имя пользователя" placement="left">
                    <span className="edit-user-info-name">{user.name}</span>
                </Tooltip>
                <Tooltip title="Идентификатор пользователя в системе" placement="left">
                    <span className="edit-user-info-id">#{user.id}</span>
                </Tooltip>
            </div>
        </>;
    return (
        <>
            <ListItem onContextMenu={handleContextMenuShow} showSeparator={true} className="edit-user-list-item">
                <div className="edit-user-area">
                    {usersInfo}
                    <div className="horizontal-expander" />
                    <Button aria-label="User settings" className="edit-user-button" ref={btnRef} tabIndex={-1}
                        onClick={handleContextMenuShow}>
                        <BiDotsHorizontalRounded className="edit-user-list-item-icon" />
                    </Button>
                </div>
            </ListItem>
            <Menu
                anchorPosition={menuPosition ?? undefined}
                anchorRef={btnRef}
                open={open}
                onClose={handleClose}
                transitionDuration={150}
                popperPlacement="bottom"
            >
                <MenuList open={open} >
                    <MenuItemWithIcon onClick={handleKickUser} endIcon={true} icon={<BiUserX />} text="Кикнуть пользователя" />
                    <MenuItemWithIcon onClick={handleBanUser} endIcon={true} icon={<BiBlock />} text="Забанить пользователя" />
                    <Divider className="menu-divider" />
                    <MenuItemCheckbox text="Разрешить выступать" onClick={getToggleFunc(setAllowPerform)} isChecked={allowPerform} />
                    <Divider className="menu-divider" />
                    <MenuItemWithIcon onClick={handleStopDemo} endIcon={true} icon={<MdOutlineStopScreenShare />} text="Прекратить демонстрацию экрана пользователя" />
                    <MenuItemWithIcon onClick={handleOffVideo} endIcon={true} icon={<BiVideoOff />} text="Оключить веб-камеры пользователя" />
                    <MenuItemWithIcon onClick={handleOffAudio} endIcon={true} icon={<BiMicrophoneOff />} text="Оключить аудио пользователя" />
                    <Divider className="menu-divider" />
                    <MenuItemWithIcon onClick={handleUserNameEdit} endIcon={true} icon={<BiEditAlt />} text="Изменить ник пользователя" />
                </MenuList>
            </Menu>
            <TextEditDialog isOpen={editNameVisible} label="Изменить ник пользователя" description={renameUserDescription} value={user.name} onClose={handleNameChangeCancel} onValueConfirm={handleNameChangeConfirm} />
        </>
    );
};

interface UserListProps
{
    filter?: string;
    roomID: string;
}

const UserList: FC<UserListProps> = ({ filter, roomID }) =>
{
    const [usersList, setUsersList] = useState<UserInfo[]>([]);

    useEffect(() =>
    {
        const userListCurRoom: UserInfo[] = (
            roomID === "G_OShinfHXD" ?
                [{ id: "id111", name: "Первый" },
                { id: "id222", name: "Второй" },
                { id: "id333", name: "Третий" }]
                : roomID === "NV6oozYIm2T" ?
                    [{ id: "id444", name: "Четвертый" },
                    { id: "id555", name: "Пятый" },
                    { id: "id666", name: "Шестой" }]
                    :
                    [{ id: "id777", name: "Седьмой" },
                    { id: "id888", name: "Восьмой" },
                    { id: "id999", name: "Девятый" },
                    { id: "id123", name: "Десятый" }]
        );
        setUsersList(userListCurRoom);
    }, [roomID]);

    const userNameFilter = (user: UserInfo): boolean =>
    {
        if (filter === undefined)
        {
            return true;
        }
        return user.name.toLowerCase().indexOf(filter.toLowerCase()) > NC.NOT_FOUND_IDX;
    };

    const createUserCard = (user: UserInfo): JSX.Element =>
    {
        return (
            <UserCard key={user.id} user={user} />
        );
    };

    return (
        <div className="edit-user-list non-selectable" tabIndex={NC.NEGATIVE_TAB_IDX}>
            <List>
                {usersList.filter(userNameFilter).map(createUserCard)}
            </List>
        </div>
    );
};

interface EditUserProps
{
    roomID: string;
    setIdRoom: ReactDispatch<string>;
}
export const ManageUsers: FC<EditUserProps> = ({ roomID, setIdRoom }) =>
{
    // Тестовые данные о комнатах
    const [roomsList, setRoomsList] = useState<PublicRoomInfo[]>([]);

    useEffect(() =>
    {
        setRoomsList(LoadedRoomList);
    }, []);

    const handleBackToRoomListClick: MouseEventHandler = () =>
    {
        setIdRoom("");
    };

    const [filter, setFilter] = useState<string>("");
    const nameRoomArea = (
        <div className="edit-user-header-area">
            <Button className="edit-user-exit-button" onClick={handleBackToRoomListClick}><RiArrowGoBackLine /></Button>
            <p className="edit-user-name-room">Управление участниками комнаты - <label className="bold">{roomsList.find(f => f.id === roomID)?.name}</label></p>
        </div>
    );
    return (
        <div className="edit-user-container">
            {nameRoomArea}
            <SearchPanel className="margin-top" filter={filter} setFilter={setFilter} />
            <UserList roomID={roomID} filter={filter} />
        </div>
    );
};
