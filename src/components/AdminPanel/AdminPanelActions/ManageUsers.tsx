import { FC, MouseEventHandler, useEffect, useRef, useState } from "react";

import { Avatar, Button, Divider } from "@mui/material";
import { UserInfo } from "nostromo-shared/types/RoomTypes";
import { BiBlock, BiDotsHorizontalRounded, BiEditAlt, BiMicrophoneOff, BiUserX, BiVideoOff } from "react-icons/bi";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";
import { LoadedRoomList, PublicRoomInfo } from "../../../services/RoomService";
import { NumericConstants as NC } from "../../../utils/NumericConstants";
import { getToggleFunc } from "../../../utils/Utils";
import { List } from "../../Base/List/List";
import { ListItem } from "../../Base/List/ListItems";
import { SearchPanel } from "../../Base/List/SearchPanel";
import { TextEditDialog } from "../../Dialog/TextEditDialog";
import { AnchorPosition, Menu, MenuList } from "../../Menu/Menu";
import { MenuItemCheckbox, MenuItemWithIcon } from "../../Menu/MenuItems";
import { Tooltip } from "../../Tooltip";

import "./ManageUsers.css";

interface ManageUsersListItemProps
{
    user: UserInfo;
}
const ManageUsersListItem: FC<ManageUsersListItemProps> = ({ user }) =>
{
    const itemRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const [menuPosition, setMenuPosition] = useState<AnchorPosition | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [allowPerform, setAllowPerform] = useState<boolean>(false);
    const [nameEditDialogOpen, setNameEditDialogOpen] = useState<boolean>(false);

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
        setOpen(true);
    };
    const handleUserNameEdit = (): void =>
    {
        setNameEditDialogOpen(true);
        handleClose();
    };
    const handleNameChangeCancel = (): void =>
    {
        itemRef.current?.focus();
        setNameEditDialogOpen(false);
    };

    const handleNameChangeConfirm = (val: string): void =>
    {
        itemRef.current?.focus();
        setNameEditDialogOpen(false);
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
            <ListItem
                onContextMenu={handleContextMenuShow}
                showSeparator={true}
                className="edit-user-list-item"
                ref={itemRef}
            >
                <div className="edit-user-area">
                    {usersInfo}
                    <div className="horizontal-expander" />
                    <Button className="edit-user-button"
                        aria-label="User settings"
                        ref={btnRef}
                        tabIndex={-1}
                        onClick={handleContextMenuShow}
                    >
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
                    <MenuItemWithIcon
                        text="Кикнуть пользователя"
                        icon={<BiUserX />}
                        endIcon={true}
                        onClick={handleKickUser}
                    />
                    <MenuItemWithIcon
                        text="Забанить пользователя"
                        icon={<BiBlock />}
                        endIcon={true}
                        onClick={handleBanUser}
                    />
                    <Divider className="menu-divider" />
                    <MenuItemCheckbox
                        text="Разрешить выступать"
                        onClick={getToggleFunc(setAllowPerform)}
                        isChecked={allowPerform}
                    />
                    <Divider className="menu-divider" />
                    <MenuItemWithIcon
                        text="Прекратить демонстрацию экрана пользователя"
                        icon={<MdOutlineStopScreenShare />}
                        endIcon={true}
                        onClick={handleStopDemo}
                    />
                    <MenuItemWithIcon
                        text="Оключить веб-камеры пользователя"
                        icon={<BiVideoOff />}
                        endIcon={true}
                        onClick={handleOffVideo}
                    />
                    <MenuItemWithIcon
                        text="Оключить аудио пользователя"
                        icon={<BiMicrophoneOff />}
                        endIcon={true}
                        onClick={handleOffAudio}
                    />
                    <Divider className="menu-divider" />
                    <MenuItemWithIcon
                        text="Изменить ник пользователя"
                        icon={<BiEditAlt />}
                        endIcon={true}
                        onClick={handleUserNameEdit}
                    />
                </MenuList>
            </Menu>
            <TextEditDialog
                open={nameEditDialogOpen}
                label="Изменить ник пользователя"
                description={renameUserDescription}
                value={user.name}
                onClose={handleNameChangeCancel}
                onValueConfirm={handleNameChangeConfirm}
            />
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

    const createUserItem = (user: UserInfo): JSX.Element =>
    {
        return (
            <ManageUsersListItem key={user.id} user={user} />
        );
    };

    return (
        <div className="edit-user-list non-selectable" tabIndex={NC.NEGATIVE_TAB_IDX}>
            <List>
                {usersList.filter(userNameFilter).map(createUserItem)}
            </List>
        </div>
    );
};

interface ManageUsersProps
{
    roomID: string;
    onClose: () => void;
}
export const ManageUsers: FC<ManageUsersProps> = ({ roomID, onClose }) =>
{
    // Тестовые данные о комнатах
    const [roomsList, setRoomsList] = useState<PublicRoomInfo[]>([]);

    useEffect(() =>
    {
        setRoomsList(LoadedRoomList);
    }, []);

    const handleBackToRoomListClick: MouseEventHandler = () =>
    {
        onClose();
    };

    const [filter, setFilter] = useState<string>("");
    const nameRoomArea = (
        <div className="edit-user-header-area">
            <Button className="edit-user-exit-button" onClick={handleBackToRoomListClick}>
                <RiArrowGoBackLine />
            </Button>
            <p className="edit-user-name-room">
                Управление участниками комнаты - <label className="bold">{roomsList.find(f => f.id === roomID)?.name}</label>
            </p>
        </div>
    );
    
    return (
        <div className="edit-user-container">
            {nameRoomArea}
            <SearchPanel
                className="margin-top"
                filter={filter}
                onFilterChange={setFilter}
            />
            <UserList roomID={roomID} filter={filter} />
        </div>
    );
};
