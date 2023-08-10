import { useSyncExternalStore } from "react";
import { AbstractExternalStorage, cloneObject } from "../Utils";
import { ParameterType, ParameterValue } from "./SettingsService";

/* eslint-disable @typescript-eslint/naming-convention */

export interface AdminPanelParameterInfo
{
    name: string;
    description?: string;
    type: ParameterType;
}

export interface AdminPanelCategory
{
    [key: string]: ParameterValue;
}

export interface AdminPanelActions
{
    [key: string]: AdminPanelCategory;

    createRoom: AdminPanelCategory;
    controlRoom: AdminPanelCategory;
    blockIP: AdminPanelCategory;
}

export interface ParametersInfoMap
{
    readonly [key: string]: AdminPanelParameterInfo;

    "createRoom.roomName": AdminPanelParameterInfo;
    "createRoom.roomPassword": AdminPanelParameterInfo;
    "createRoom.roomCodec": AdminPanelParameterInfo;
    "createRoom.roomSaveHistory": AdminPanelParameterInfo;
    "createRoom.roomSymmetricalMode": AdminPanelParameterInfo;
}

export const parametersInfoMap: ParametersInfoMap = {
    "createRoom.roomName":
    {
        name: "Введите название комнаты",
        type: "Input",
        description: "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddЭто тестовое описание... Ну в общем эта фича позволяет отображать участников, которые не активные. " +
            "Ну ты понял крч, в названии вроде бы так и написано",
    },
    "createRoom.roomPassword":
    {
        name: "Введите пароль от комнаты",
        type: "Input",
        description: "Краткое описание параметра. Смотрите, наблюдайте, восхищайтесь",
    },
    "createRoom.roomCodec":
    {
        name: "Выберите кодек",
        type: "Select",
        description: "Краткое описание параметра. Смотрите, наблюдайте, восхищайтесь",
    },
    "createRoom.roomSaveHistory":
    {
        name: "Сохранять историю чата",
        type: "Switch",
        description: "Краткое описание параметра. Смотрите, наблюдайте, восхищайтесь",
    },
    "createRoom.roomSymmetricalMode":
    {
        name: "Симметричный режим",
        type: "Switch",
        description: "Краткое описание параметра. Смотрите, наблюдайте, восхищайтесь",
    },
}

const adminActions: AdminPanelActions =
{
    createRoom:
    {
        roomName: "",
        roomPassword: "",
        roomCodec: "",
        roomSaveHistory: "",
        roomSymmetricalMode: ""
    },
    controlRoom:
    {
        
    },
    blockIP:
    {

    }
}

export class AdminService extends AbstractExternalStorage
{
    private readonly snapshot: AdminPanelActions = adminActions;

    public constructor()
    {
        super();

        this.snapshot = cloneObject(adminActions);
    }

    public getSettingsSnapshot(): AdminPanelActions
    {
        return this.snapshot;
    }
}

export function useAdminActions(service: AdminService): AdminPanelActions
{
    return useSyncExternalStore(
        (listener: () => void) => service.subscribe(listener),
        () => service.getSettingsSnapshot()
    );
}
