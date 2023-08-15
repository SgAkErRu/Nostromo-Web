import { FC, MouseEventHandler } from "react";
import { ListItem, ListItemProps } from "../List/ListItems";
import "./RoomListItem.css"
import { PublicRoomInfo } from "../../../services/RoomService";
import { Avatar } from "@mui/material";
import { ZERO_IDX } from "../../../Utils";


interface RoomListItemProps extends ListItemProps
{
    room : PublicRoomInfo;
    actions? : JSX.Element[];
    contextMenuHandler? : MouseEventHandler<HTMLDivElement>;
    activateHandler? : () => void;
}

export const RoomListItem : FC<RoomListItemProps> = ({room, actions, contextMenuHandler, activateHandler, ...props}) =>
{
    const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (ev) =>
    {
        if (activateHandler && (ev.code === "Enter" || ev.code === "Space"))
        {
            ev.preventDefault();
            activateHandler();
        }
    }

    return (
        <ListItem onKeyDown={onKeyDown} onContextMenu={contextMenuHandler} className="room-list-item" {...props}>
            <div className="room-list-item-area">
                <div className="room-list-item-avatar-container">
                    <Avatar className="room-list-item-avatar" children={room.name[ZERO_IDX]} />
                </div>
                <div className="room-list-item-info-area">
                    <label className="room-list-item-name">{room.name}</label>
                    <span className="room-list-item-id">#{room.id}</span>
                </div>
                <div className="horizontal-expander" />
                {actions}
            </div>
        </ListItem>
    )
}
