import React from "react";

import "./HeaderRoomToolbar.css";

import { IconButton } from "@mui/material";
import { BsChatTextFill, BsPeopleFill } from "react-icons/bs";
import { Tooltip } from "./Tooltip";

export type ToggleUserListBtnInfo = {
    isUserListHidden: boolean,
    setIsUserListHidden: (state: boolean) => void;
};
export type ToggleChatBtnInfo = {
    isChatHidden: boolean,
    setIsChatHidden: (state: boolean) => void;
};
export interface HeaderRoomToolbarProps
{
    toggleUserListBtnInfo: ToggleUserListBtnInfo;
    toggleChatBtnInfo: ToggleChatBtnInfo;
}

export const HeaderRoomToolbar: React.FC<HeaderRoomToolbarProps> = ({ toggleUserListBtnInfo, toggleChatBtnInfo }) =>
{
    const toggleChatBtn =
        <Tooltip title={!toggleChatBtnInfo.isChatHidden ? "Скрыть чат" : "Показать чат"}>
            <IconButton aria-label="Hide/show chat"
                className={
                    toggleChatBtnInfo.isChatHidden
                        ? "toolbar-btn toolbar-btn-inactive"
                        : "toolbar-btn toolbar-btn-active"
                }
                onClick={() => toggleChatBtnInfo.setIsChatHidden(!toggleChatBtnInfo.isChatHidden)}>
                <BsChatTextFill />
            </IconButton>
        </Tooltip>;

    const toggleUserListBtn =
        <Tooltip title={!toggleUserListBtnInfo.isUserListHidden ? "Скрыть список участников" : "Показать список участников"}>
            <IconButton aria-label="Hide/show user list" size="medium"
                className={
                    toggleUserListBtnInfo.isUserListHidden
                        ? "toolbar-btn toolbar-btn-inactive"
                        : "toolbar-btn toolbar-btn-active"
                }
                onClick={() => toggleUserListBtnInfo.setIsUserListHidden(!toggleUserListBtnInfo.isUserListHidden)}>
                <BsPeopleFill />
            </IconButton>
        </Tooltip>;

    return (
        <div id="header-room-toolbar">
            {toggleChatBtn}
            {toggleUserListBtn}
        </div>
    );
};