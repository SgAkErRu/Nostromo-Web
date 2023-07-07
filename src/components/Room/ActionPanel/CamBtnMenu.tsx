import { Divider, MenuItem, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";

import { DeviceListItem } from "../../../pages/RoomPage";
import { Menu } from "../../Menu/Menu";
import { MenuItemRadio, MenuSectionLabel, MenuSelect } from "../../Menu/MenuItems";
import { Tooltip } from "../../Tooltip";

import "./CamBtnMenu.css";
import { ResolutionObject } from "./RoomActionPanel";

interface CamBtnMenuProps
{
    anchorRef: React.RefObject<HTMLDivElement>;
    open: boolean;
    setOpen: (state: boolean) => void;
    camList: DeviceListItem[];
    transitionDuration: number;
}

export const CamBtnMenu: React.FC<CamBtnMenuProps> = ({ anchorRef, open, setOpen, camList, transitionDuration }) =>
{
    //TODO: вытащить selectedCam выше в RoomActionPanel -> RoomPage

    const [selectedCam, setSelectedCam] = useState<string>("testCamDeviceId1");

    const [fps, setFps] = useState<string>("default");
    const [resolution, setResolution] = useState<string>("default");
    const resolutionList: ResolutionObject[] = [
        { width: 2560, height: 1440, name: "WQHD" },
        { width: 1920, height: 1080, name: "FHD" },
        { width: 1280, height: 720, name: "HD" },
        { width: 640, height: 480, name: "SD" },
        { width: 480, height: 360, name: "LD" },
        { width: 320, height: 240, name: "240p" }
    ];

    const resolutionListToListItems = (resObj: ResolutionObject, index: number): JSX.Element =>
    {
        const resolutionStr = `${resObj.width}⨯${resObj.height}`;

        return (
            <MenuItem value={resolutionStr} key={index}>
                <span className="v-align-middle">{resolutionStr}</span>
                <div className="horizontal-expander" />
                <span className="chip-resolution">{resObj.name}</span>
            </MenuItem>
        );
    };

    const camListToListItems = (cam: DeviceListItem, index: number): JSX.Element =>
    {
        const isSelected = selectedCam === cam.deviceId;

        return (
            <MenuItemRadio
                isSelected={isSelected}
                text={cam.name}
                key={index}
                onClick={() => { setSelectedCam(cam.deviceId); }}
            />
        );
    };

    const handleSelectResolution = (ev: SelectChangeEvent): void =>
    {
        setResolution(ev.target.value);
        console.log(ev.target.value);
    };

    const SelectResolution: React.FC = () =>
    {
        return (
            <MenuSelect
                id="select-cam-resolution"
                value={resolution}
                onChange={handleSelectResolution}
                transitionDuration={transitionDuration}
            >
                <MenuItem value={"default"}>По умолчанию</MenuItem>
                <Divider className="menu-divider" />
                {resolutionList.map(resolutionListToListItems)}
            </MenuSelect>
        );
    };

    const handleSelectFps = (ev: SelectChangeEvent): void =>
    {
        setFps(ev.target.value);
        console.log(ev.target.value);
    };

    const SelectFps: React.FC = () =>
    {
        return (
            <MenuSelect
                id="select-cam-fps"
                value={fps}
                onChange={handleSelectFps}
                transitionDuration={transitionDuration}
            >
                <MenuItem value={"default"}>По умолчанию</MenuItem>
                <Divider className="menu-divider" />
                <MenuItem value={"60"}><span className="v-align-middle">60</span></MenuItem>
                <MenuItem value={"50"}><span className="v-align-middle">50</span></MenuItem>
                <MenuItem value={"30"}><span className="v-align-middle">30</span></MenuItem>
                <MenuItem value={"15"}><span className="v-align-middle">15</span></MenuItem>
            </MenuSelect>
        );
    };

    return (
        <Menu
            id="toggle-cam-btn-menu"
            anchorRef={anchorRef}
            open={open}
            onClose={() => { setOpen(false); }}
            transitionDuration={transitionDuration}
        >
            <MenuSectionLabel text="Выбор камеры" />
            {camList.map(camListToListItems)}
            <Divider className="menu-divider" />
            <Tooltip id="tooltip-select-cam-resolution" title={"Разрешение изображения в пикселях"} offset={2} placement="right">
                <div className="inline"><MenuSectionLabel text="Настройка качества" withTooltip /></div>
            </Tooltip>
            <SelectResolution />
            <Divider className="menu-divider" />
            <Tooltip id="tooltip-select-cam-fps" title={"Количество кадров в секунду"} offset={2} placement="right">
                <div className="inline"><MenuSectionLabel text="Настройка плавности (FPS)" withTooltip /></div>
            </Tooltip>
            <SelectFps />
        </Menu>
    );
};