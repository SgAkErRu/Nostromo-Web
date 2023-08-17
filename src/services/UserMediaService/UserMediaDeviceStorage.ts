import { isEmptyString } from "../../Utils";

type Listener = () => void;

//FIXME: переделать, используя AbstractExternalStorage.
export class UserMediaDeviceStorage
{
    private m_mediaDevices: MediaDeviceInfo[] = [];

    private m_listeners: Listener[] = [];

    public constructor()
    {
        console.debug("UserMediaDeviceStorage constructor");
    }

    public async setDevices(): Promise<void>
    {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();

        this.m_mediaDevices = [];

        let audioDeviceCounter = 1;
        let videoDeviceCounter = 1;

        for (const device of mediaDevices)
        {
            // Пропустим виртуальное устройство в Chrome (который "По умолчанию для связи").
            if (device.deviceId === "communications")
            {
                continue;
            }

            // Пропустим устройства с ненужным типом (аудиовывод и так далее).
            if (device.kind !== "audioinput" && device.kind !== "videoinput")
            {
                continue;
            }

            const genericDeviceLabel = (device.kind === "audioinput")
                ? `Микрофон #${audioDeviceCounter++}`
                : `Веб-камера #${videoDeviceCounter++}`;

            let label = !isEmptyString(device.label) ? device.label : genericDeviceLabel;

            if (device.deviceId === "default")
            {
                label = "Как в системе";
            }

            this.m_mediaDevices.push({ ...device, label });
        }

        this.notifyListeners();
    }

    public addListener(listener: Listener): void
    {
        this.m_listeners = [...this.m_listeners, listener];
    }

    public removeListener(listener: Listener): void
    {
        this.m_listeners = this.m_listeners.filter(l => l !== listener);
    }

    public subscribe(listener: Listener): () => void
    {
        this.addListener(listener);
        return () => { this.removeListener(listener); };
    }

    public getDevicesSnapshot(): MediaDeviceInfo[]
    {
        return this.m_mediaDevices;
    }

    private notifyListeners(): void
    {
        for (const listener of this.m_listeners)
        {
            listener();
        }
    }
}

export function useSettings(service: SettingService): Settings
{
    return useSyncExternalStore(
        (listener: () => void) => service.subscribe(listener),
        () => service.getSettingsSnapshot()
    );
}
