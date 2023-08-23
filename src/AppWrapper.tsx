
import { createContext } from "react";
import { SettingService } from "./services/SettingsService";
import App from "./App";
import { NotificationsService } from "./services/NotificationsService";

export const SettingsContext = createContext<SettingService>(new SettingService()); 

const notificationService: NotificationsService = new NotificationsService();

export const NotificationsContext = createContext<NotificationsService>(notificationService);

export const AppWrapper: React.FC = () =>
{
    return (
        <App />
    );
};
