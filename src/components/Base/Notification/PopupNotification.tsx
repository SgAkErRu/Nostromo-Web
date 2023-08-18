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
        if(isAnimated === true)
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
        if (autocloseTime !== undefined)
        {
            setTimeout(handleCancelNotification, autocloseTime);
        }
    }, [autocloseTime, handleCancelNotification]);


    return (
        <div className={"regular-notification-area"} style={isClosed ? {opacity: 0} : {}} >
            <NotificationCard notification={notification} onCancel={handleCancelNotification}/>
        </div>
    );
};
