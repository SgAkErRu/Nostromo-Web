import { Button } from "@mui/material";
import React, { Dispatch, SetStateAction, useContext, useRef } from 'react';
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { MdMic, MdMicOff, MdScreenShare, MdStopScreenShare, MdVideocam, MdVideocamOff, MdVolumeOff, MdVolumeUp } from "react-icons/md";
import { Tooltip } from "../../Tooltip";

import { getToggleFunc } from "../../../Utils";
import { DeviceListItem, MicState, SoundState } from "../../../pages/RoomPage";
import { MicBtnMenu } from "./MicBtnMenu";
import "./RoomActionPanel.css";
import { CamBtnMenu } from "./CamBtnMenu";
import { DisplayBtnMenu } from "./DisplayBtnMenu";
import { UserMediaServiceContext } from "../../../AppWrapper";
import { ResolutionObject } from "../../../services/UserMediaService";

export interface ActionBtnInfo<S>
{
    state: S;
    setState: Dispatch<SetStateAction<S>>;
}

export interface ActionBtnWithMenuInfo<S> extends ActionBtnInfo<S>
{
    menuOpen: boolean;
    toggleMenu: () => void;
}

export interface ActionDeviceBtn<S> extends ActionBtnWithMenuInfo<S>
{
    deviceList: DeviceListItem[];
}

export interface RoomActionPanelProps
{
    soundBtnInfo: ActionBtnInfo<SoundState>;
    micBtnInfo: ActionDeviceBtn<MicState>;
    camBtnInfo: ActionDeviceBtn<boolean>;
    displayBtnInfo: ActionBtnWithMenuInfo<boolean>;
    transitionDuration: number;
}

export const RoomActionPanel: React.FC<RoomActionPanelProps> = ({
    soundBtnInfo,
    micBtnInfo,
    camBtnInfo,
    displayBtnInfo,
    transitionDuration
}) =>
{
    const userMediaService = useContext(UserMediaServiceContext);

    /// Sound button ----------------------------- ///

    const isSoundEnabled = (soundBtnInfo.state === SoundState.ENABLED);
    const soundBtnMsg = isSoundEnabled ? "Выключить звуки собеседников" : "Включить звуки собеседников";

    const soundBtnOnClick = (): void =>
    {
        soundBtnInfo.setState((prevState) =>
        {
            if (prevState === SoundState.ENABLED)
            {
                return SoundState.DISABLED_WITH_ALERT;
            }
            else
            {
                return SoundState.ENABLED;
            }
        });
    };

    const soundBtn = (
        <Tooltip id="tooltip-toggle-sound-btn" title={soundBtnMsg} offset={10}>
            <div className="action-btn-box non-selectable">
                <Button aria-label="Turn on/off sound"
                    className={"action-btn " + (isSoundEnabled ? "action-btn-on" : "action-btn-off")}
                    onClick={soundBtnOnClick}>
                    <MdVolumeUp className="action-btn-icon action-btn-icon-on" />
                    <MdVolumeOff className="action-btn-icon action-btn-icon-off" />
                </Button>
                <span className="action-btn-desc">Звук</span>
                <div className="action-btn-clickable-area non-selectable" onClick={soundBtnOnClick}></div>
            </div>
        </Tooltip>
    );

    /// Mic button ------------------------------- ///

    const isMicWorking = (micBtnInfo.state === MicState.WORKING);
    const micBtnBoxRef = useRef<HTMLDivElement>(null);
    const micBtnMsg = isMicWorking ? "Выключить микрофон" : "Включить микрофон";

    const micBtnOnClick = async (): Promise<void> =>
    {
        //TODO: 1. block button before result
        // 2. setSelectedMic -> if true

        const state = micBtnInfo.state;

        if (state === MicState.DISABLED)
        {
            const result = await userMediaService.getMic("testMicDeviceId2");

            if (!result)
            {
                return;
            }

            micBtnInfo.setState(MicState.WORKING);
        }
        else if (state === MicState.PAUSED)
        {
            userMediaService.unpauseMic();
            micBtnInfo.setState(MicState.WORKING);
        }
        else
        {
            userMediaService.pauseMic();
            micBtnInfo.setState(MicState.PAUSED);
        }
    };

    const handleDisableMic = (): void =>
    {
        userMediaService.stopMic();
        micBtnInfo.setState(MicState.DISABLED);
    };

    const micBtn = (<>
        <div className="action-btn-box non-selectable" ref={micBtnBoxRef}>
            <Tooltip id="tooltip-toggle-mic-btn" title={micBtnMsg} offset={15}>
                <div>
                    <Button aria-label="Enable/disable mic"
                        className={"action-btn " + (isMicWorking ? "action-btn-on" : "action-btn-off")}
                        onClick={micBtnOnClick}
                    >
                        <MdMic className="action-btn-icon action-btn-icon-on" />
                        <MdMicOff className="action-btn-icon action-btn-icon-off" />
                    </Button>
                    <div className="action-btn-clickable-area non-selectable" onClick={micBtnOnClick}></div>
                </div>
            </Tooltip>
            <Button className="action-list-btn"
                onClick={micBtnInfo.toggleMenu}>
                {micBtnInfo.menuOpen ? <BiChevronUp /> : <BiChevronDown />}
            </Button>
            <span className="action-btn-desc">Микрофон</span>
            <div className="action-list-btn-clickable-area non-selectable" onClick={micBtnInfo.toggleMenu}></div>
        </div>
        <MicBtnMenu
            anchorRef={micBtnBoxRef}
            open={micBtnInfo.menuOpen}
            setOpen={micBtnInfo.toggleMenu}
            micEnabled={micBtnInfo.state !== MicState.DISABLED}
            disableMic={handleDisableMic}
            micList={micBtnInfo.deviceList}
            transitionDuration={transitionDuration}
        />
    </>);

    /// Cam button ------------------------------- ///

    const camBtnBoxRef = useRef<HTMLDivElement>(null);
    const camBtnMsg = camBtnInfo.state ? "Выключить веб-камеру" : "Включить веб-камеру";

    const camBtnOnClick = async (): Promise<void> =>
    {
        //TODO: 1. block button before result
        // 2. setSelectedCam -> if true
        // 3. get selectedResolution and fps

        const selectedResolution: ResolutionObject = { width: 1920, height: 1080 };
        const selectedFps = 30;

        if (!camBtnInfo.state)
        {
            const result = await userMediaService.getCam(
                "testCamDeviceId2",
                selectedResolution,
                selectedFps
            );

            if (!result)
            {
                return;
            }

            camBtnInfo.setState(true);
        }
        else
        {
            userMediaService.stopCam("testCamDeviceId2");
            camBtnInfo.setState(false);
        }
    };

    //TODO: надо сделать так, что
    // если выбранная вебка захвачена - тогда будет кнопка выключения.
    // Если не захвачена, то включения.

    const camBtn = (<>
        <div className="action-btn-box non-selectable" ref={camBtnBoxRef}>
            <Tooltip id="tooltip-toggle-cam-btn" title={camBtnMsg} offset={15}>
                <div>
                    <Button aria-label="Enable/disable webcam"
                        className={"action-btn " + (camBtnInfo.state ? "action-btn-on" : "action-btn-off")}
                        onClick={camBtnOnClick}>
                        <MdVideocam className="action-btn-icon action-btn-icon-on" />
                        <MdVideocamOff className="action-btn-icon action-btn-icon-off" />
                    </Button>
                    <div className="action-btn-clickable-area non-selectable" onClick={camBtnOnClick}></div>
                </div>
            </Tooltip>
            <Button className="action-list-btn"
                onClick={camBtnInfo.toggleMenu}>
                {camBtnInfo.menuOpen ? <BiChevronUp /> : <BiChevronDown />}
            </Button>
            <span className="action-btn-desc">Камера</span>
            <div className="action-list-btn-clickable-area non-selectable" onClick={camBtnInfo.toggleMenu}></div>
        </div>
        <CamBtnMenu
            anchorRef={camBtnBoxRef}
            open={camBtnInfo.menuOpen}
            setOpen={camBtnInfo.toggleMenu}
            camList={camBtnInfo.deviceList}
            transitionDuration={transitionDuration}
        />
    </>);

    /// Display button --------------------------- ///

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const displayBtnBoxRef = useRef<HTMLDivElement>(null);
    const displayBtnMsg = displayBtnInfo.state ? "Выключить демонстрацию экрана" : "Включить демонстрацию экрана";

    const displayBtnOnClick = getToggleFunc(displayBtnInfo.setState);

    const displayBtn = (<>
        <div className="action-btn-box non-selectable" ref={displayBtnBoxRef}>
            <Tooltip id="tooltip-toggle-display-btn" title={displayBtnMsg} offset={15}>
                <div>
                    <Button aria-label="Start/stop screensharing"
                        className={"action-btn " + (displayBtnInfo.state ? "action-btn-optional action-btn-on" : "action-btn-optional action-btn-off")}
                        onClick={displayBtnOnClick}>
                        <MdScreenShare className="action-btn-icon action-btn-icon-on" />
                        <MdStopScreenShare className="action-btn-icon action-btn-icon-off" />
                    </Button>
                    <div className="action-btn-clickable-area non-selectable" onClick={displayBtnOnClick}></div>
                </div>
            </Tooltip>
            <Button className="action-list-btn"
                onClick={displayBtnInfo.toggleMenu}>
                {displayBtnInfo.menuOpen ? <BiChevronUp /> : <BiChevronDown />}
            </Button>
            <span className="action-btn-desc">Экран</span>
            <div className="action-list-btn-clickable-area non-selectable" onClick={displayBtnInfo.toggleMenu}></div>
        </div>
        <DisplayBtnMenu
            anchorRef={displayBtnBoxRef}
            open={displayBtnInfo.menuOpen}
            setOpen={displayBtnInfo.toggleMenu}
            transitionDuration={transitionDuration}
        />
    </>);

    /// ------------------------------------------ ///

    return (
        <div id="action-panel-container">
            <div className="horizontal-expander"></div>
            {soundBtn}
            {micBtn}
            {camBtn}
            {isMobile ? <></> : displayBtn}
            <div className="horizontal-expander"></div>
        </div>
    );
};
