import React, { useCallback, useEffect, useState } from "react";
import "./RegularNotification.css";
import { Notification } from "../../../services/NotificationsService";
import { SeverityNotification } from "./SeverityNotification";

const COLLAPS_TIME = 210;

interface RegularNotificationProps
{
    notification: Notification;
    onCancel: (id: number) => void;
    isAnimated? : boolean;
    autocloseTime? : number;
}
export const RegularNotification: React.FC<RegularNotificationProps> = ({ notification, onCancel, isAnimated, autocloseTime }) =>
{
    const [isClosed, setIsClosed] = useState<boolean>(false);
    
    const handleCancelNotification = useCallback(() : void =>
    {
        if(isAnimated === true)
        {
            setIsClosed(true);
            setTimeout(()=>{onCancel(notification.id);}, COLLAPS_TIME);
        }
        else
        {
            onCancel(notification.id);
        }
    }, [isAnimated, notification.id, onCancel])

    useEffect(() => {
        if (autocloseTime !== undefined)
        {
            setTimeout(handleCancelNotification, autocloseTime);
        }
    }, [autocloseTime, handleCancelNotification]);


    return (
        <div className={"regular-notification-area"} style={isClosed ? {opacity: 0} : {}} >
            <SeverityNotification notification={notification} onCancel={handleCancelNotification}/>
        </div>
    );
};
