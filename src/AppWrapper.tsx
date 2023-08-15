
import { createContext } from "react";
import { SettingService } from "./services/SettingsService";
import GeneralSocketService from "./services/GeneralSocketService";
import { UserMediaService } from "./services/UserMediaService";
import App from "./App";

export const SettingsContext = createContext<SettingService>(new SettingService());
export const GeneralSocketServiceContext = createContext<GeneralSocketService>(new GeneralSocketService());
export const UserMediaServiceContext = createContext<UserMediaService>(new UserMediaService());

export const AppWrapper: React.FC = () =>
{
    return (
        <App />
    );
};
