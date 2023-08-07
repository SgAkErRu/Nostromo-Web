
import { createContext } from "react";
import { SettingService } from "./services/SettingsService";
import GeneralSocketService from "./services/GeneralSocketService";
import App from "./App";

export const SettingsContext = createContext<SettingService>(new SettingService());
export const GeneralSocketServiceContext = createContext<GeneralSocketService>(new GeneralSocketService());

export const AppWrapper: React.FC = () =>
{
    return (
        <App />
    );
};
