
import { createContext } from "react";
import { SettingService } from "./services/SettingsService";
import App from "./App";
import { NotificationsService } from "./services/NotificationsService";

export const SettingsContext = createContext<SettingService>(new SettingService());
export const NotificationsContext = createContext<NotificationsService>(new NotificationsService());

export const AppWrapper: React.FC = () =>
{
    return (
        <App />
    );
};
