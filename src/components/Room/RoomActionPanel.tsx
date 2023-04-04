import { Button } from "@mui/material";
import React from 'react';
import { MdVolumeOff, MdVolumeUp, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdScreenShare, MdStopScreenShare } from "react-icons/md";
import { Tooltip } from "../Tooltip";
import { BiChevronDown } from "react-icons/bi";

import "./RoomActionPanel.css";
import { MicPauseIcon, MicUnpauseIcon } from "../CustomIcons";

export type ToggleBtnInfo = {
    state: boolean,
    setState: (state: boolean) => void;
};

export interface RoomActionPanelProps
{
    toggleSoundBtnInfo: ToggleBtnInfo;
    toggleMicBtnInfo: ToggleBtnInfo;
    toggleMicPauseBtnInfo: ToggleBtnInfo;
    toggleCamBtnInfo: ToggleBtnInfo;
    toggleScreenBtnInfo: ToggleBtnInfo;
}

export const RoomActionPanel: React.FC<RoomActionPanelProps> = ({
    toggleSoundBtnInfo,
    toggleMicBtnInfo,
    toggleMicPauseBtnInfo,
    toggleCamBtnInfo,
    toggleScreenBtnInfo
}) =>
{
    const toggleSoundBtnMsg = toggleSoundBtnInfo.state ? "Выключить звуки собеседников" : "Включить звуки собеседников";

    const toggleSoundBtnOnClick = () =>
    {
        toggleSoundBtnInfo.setState(!toggleSoundBtnInfo.state);
    };

    const toggleSoundBtn =
        <Tooltip title={toggleSoundBtnMsg} offset={10}>
            <div className="action-btn-box non-selectable"
                onClick={toggleSoundBtnOnClick}>
                <Button aria-label="Turn on/off sound"
                    className={"action-btn " + (toggleSoundBtnInfo.state ? "action-btn-off" : "action-btn-on")}
                    onClick={toggleSoundBtnOnClick}>
                    {toggleSoundBtnInfo.state ? <MdVolumeOff /> : <MdVolumeUp />}
                </Button>
                <span className="action-btn-desc">Звук</span>
            </div >
        </Tooltip>;

    const toggleMicBtnMsg = toggleMicBtnInfo.state ? "Прекратить захват микрофона" : "Захватить микрофон";

    const toggleMicBtnOnClick = () =>
    {
        toggleMicBtnInfo.setState(!toggleMicBtnInfo.state);
    };

    const toggleMicBtn =
        <Tooltip title={toggleMicBtnMsg} offset={10}>
            <div className="action-btn-box non-selectable">
                <Button aria-label="Start/stop capture mic"
                    className={"action-btn " + (toggleMicBtnInfo.state ? "action-btn-off" : "action-btn-on")}
                    onClick={toggleMicBtnOnClick}>
                    {toggleMicBtnInfo.state ? <MdMicOff /> : <MdMic />}
                </Button>
                <Button className="action-list-btn"><BiChevronDown /></Button>
                <span className="action-btn-desc">Микрофон</span>
                <div className="action-btn-clickable-area non-selectable" onClick={toggleMicBtnOnClick}></div>
                <div className="action-list-btn-clickable-area non-selectable" onClick={() => {console.log("2")}}></div>
            </div >
        </Tooltip>;

    const toggleMicPauseBtnMsg = toggleMicPauseBtnInfo.state ? "Включить звук микрофона" : "Временно приглушить звук микрофона";

    const toggleMicPauseBtnOnClick = () =>
    {
        toggleMicPauseBtnInfo.setState(!toggleMicPauseBtnInfo.state);
    };

    const toggleMicPauseBtn =
        <Tooltip title={toggleMicPauseBtnMsg} offset={10}>
            <div className="action-btn-box non-selectable"
                onClick={toggleMicPauseBtnOnClick}>
                <Button aria-label="Mute/unmute mic"
                    className={"action-btn " + (toggleMicPauseBtnInfo.state ? "action-btn-on" : "action-btn-off")}
                    onClick={toggleMicPauseBtnOnClick}>
                    {toggleMicPauseBtnInfo.state ? <MicUnpauseIcon /> : <MicPauseIcon />}
                </Button>
                <span className="action-btn-desc">{toggleMicPauseBtnInfo.state ? "Включить" : "Приглушить"}</span>
            </div >
        </Tooltip>;

    const toggleCamBtnMsg = toggleCamBtnInfo.state ? "Прекратить захват веб-камеры" : "Захватить веб-камеру";

    const toggleCamBtnOnClick = () =>
    {
        toggleCamBtnInfo.setState(!toggleCamBtnInfo.state);
    };

    const toggleCamBtn =
        <Tooltip title={toggleCamBtnMsg} offset={10}>
            <div className="action-btn-box non-selectable">
                <Button aria-label="Start/stop capture webcam"
                    className={"action-btn " + (toggleCamBtnInfo.state ? "action-btn-off" : "action-btn-on")}
                    onClick={toggleCamBtnOnClick}>
                    {toggleCamBtnInfo.state ? <MdVideocamOff /> : <MdVideocam />}
                </Button>
                <Button className="action-list-btn"><BiChevronDown /></Button>
                <span className="action-btn-desc">Камера</span>
                <div className="action-btn-clickable-area non-selectable" onClick={toggleCamBtnOnClick}></div>
                <div className="action-list-btn-clickable-area non-selectable" onClick={() => {console.log("2")}}></div>
            </div >
        </Tooltip>;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const toggleScreenBtnMsg = toggleScreenBtnInfo.state ? "Прекратить демонстрацию экрана" : "Запустить демонстрацию экрана";

    const toggleScreenBtnOnClick = () =>
    {
        toggleScreenBtnInfo.setState(!toggleScreenBtnInfo.state);
    };

    const toggleScreenBtn =
        <Tooltip title={toggleScreenBtnMsg} offset={10}>
            <div className="action-btn-box non-selectable">
                <Button aria-label="Start/stop capture webcam"
                    className={"action-btn " + (toggleScreenBtnInfo.state ? "action-btn-off" : "action-btn-on")}
                    onClick={toggleScreenBtnOnClick}>
                    {toggleScreenBtnInfo.state ? <MdStopScreenShare /> : <MdScreenShare />}
                </Button>
                <Button className="action-list-btn"><BiChevronDown /></Button>
                <span className="action-btn-desc">Экран</span>
                <div className="action-btn-clickable-area non-selectable" onClick={toggleScreenBtnOnClick}></div>
                <div className="action-list-btn-clickable-area non-selectable" onClick={() => {console.log("2")}}></div>
            </div >
        </Tooltip>;


    return (
        <div id="action-panel-container">
            <div className="horizontal-expander"></div>
            {toggleSoundBtn}
            {toggleMicBtn}
            {toggleMicBtnInfo.state ? toggleMicPauseBtn : <></>}
            {toggleCamBtn}
            {isMobile ? <></> : toggleScreenBtn}
            <div className="horizontal-expander"></div>
        </div>
    );
};