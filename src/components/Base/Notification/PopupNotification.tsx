import React, { useCallback, useEffect, useState } from "react";
import "./PopupNotification.css";
import { Notification } from "../../../services/NotificationsService";
import { NotificationCard } from "./NotificationCard";

interface PopupNotificationProps
{
    notification: Notification;
    onCancel: (id: number) => void;
    isAnimated? : boolean;
    autocloseTime? : number;
    collapseTime? : number;
}
export const PopupNotification: React.FC<PopupNotificationProps> = ({ notification, onCancel, isAnimated, autocloseTime, collapseTime }) =>
{
    const [isClosed, setIsClosed] = useState<boolean>(false);
    
    const handleCancelNotification = useCallback(() : void =>
    {
        if(collapseTime !== undefined && isAnimated === true)
        {
            setIsClosed(true);
            setTimeout(()=>{onCancel(notification.id);}, collapseTime);
        }
        else
        {
            onCancel(notification.id);
        }
    }, [isAnimated, notification.id, onCancel, collapseTime])

    useEffect(() => {
        let timer : NodeJS.Timeout | null = null;
        if (autocloseTime !== undefined)
        {
            timer = setTimeout(handleCancelNotification, autocloseTime);
        }

        return () => 
        {
            if (timer)
            {
                clearTimeout(timer);
            }
        };
    }, [autocloseTime, handleCancelNotification]);

    const transitionTime = collapseTime !== undefined ? `all ${collapseTime}ms` : undefined;

    return (
        <div className={"regular-notification-area"} style={isClosed ? {opacity: 0, transition: transitionTime } : {transition: transitionTime}} >
            <NotificationCard notification={notification} onCancel={handleCancelNotification}/>
        </div>
    );
};
