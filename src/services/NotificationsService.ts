import { useSyncExternalStore } from "react";
import { AbstractExternalStorage, cloneObject } from "../Utils";

export enum NotificationType
{
    INFO = 0,
    ERROR = 1
}

export interface Notification
{
    id : number;
    label : string;
    description : string;
    type : NotificationType;
}

export class NotificationsService extends AbstractExternalStorage
{
    private readonly m_Notifications : Notification[] = [];
    private m_Snapshot : Notification[] = [];

    public constructor()
    {
        super();
    }

    public push(label : string, description : string, type : NotificationType = NotificationType.INFO) : void
    {
        this.m_Notifications.push({id: new Date().getTime(), label: label, description: description, type: type});
        this.saveSnapshot();
        this.notifyListeners();
    }

    public remove(id : number) : void
    {
        this.m_Notifications.filter(p => p.id !== id);
        this.saveSnapshot();
        this.notifyListeners();
    }

    public getSnapshot() : Notification[]
    {
        return this.m_Snapshot;
    }

    protected saveSnapshot() : void
    {
        this.m_Snapshot = cloneObject(this.m_Notifications);
    }
}

export function useNotifications(service: NotificationsService) : Notification[]
{
    return useSyncExternalStore(
        (listener: () => void) => service.subscribe(listener),
        () => service.getSnapshot()
    );
}
