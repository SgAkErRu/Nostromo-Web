import { useSyncExternalStore } from "react";
import { AbstractExternalStorage, cloneObject } from "../Utils";

const ID_START_VALUE = 0;

export enum NotificationSeverity
{
    INFO = 0,
    WARNING = 1,
    ERROR = 2
}

export enum NotificationType
{
    POPUP = 0,
    CRITICAL = 1
}

interface NotificationBase
{
    label : string;
    description : string;
    severity : NotificationSeverity;
    type : NotificationType;
    date : Date;
}

export interface Notification extends NotificationBase
{
    id : number;
}

export class NotificationsService extends AbstractExternalStorage
{
    private m_ID = ID_START_VALUE;
    private m_Notifications : Notification[] = [];
    private m_Snapshot : Notification[] = [];

    public constructor()
    {
        super();
    }

    public add(notification : NotificationBase) : void
    {
        this.m_Notifications.push({...notification, id: this.m_ID++ });
        this.saveSnapshot();
        this.notifyListeners();
    }

    public remove(id : number) : void
    {
        this.m_Notifications = this.m_Notifications.filter(p => p.id !== id);
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
