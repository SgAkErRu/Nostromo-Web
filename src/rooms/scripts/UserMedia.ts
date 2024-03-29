import { UI, UiSound } from "./UI";
import { Room } from "./Room";
import { MicAudioProcessing } from "./MicAudioProcessing";
import { UnsupportedError } from "./AppError";

declare global
{
    interface MediaTrackConstraintSet
    {
        autoGainControl?: ConstrainBoolean,
        noiseSuppression?: ConstrainBoolean;
    }

    interface Window
    {
        webkitAudioContext: typeof AudioContext;
    }
}

/** Класс, получающий медиапотоки пользователя. */
export class UserMedia
{
    /** Объект для работы с интерфейсом. */
    private readonly ui: UI;

    /** Объект - комната. */
    private readonly room: Room;

    /** Медиапотоки. */
    private streams = new Map<string, MediaStream>();

    /** Список захваченных видеоустройств. */
    private capturedVideoDevices = new Set<string>();

    /** Идентификатор видеоустройства, захваченного в главном медиапотоке (main). */
    private mainStreamVideoDeviceId = "";

    /** Настройки медиапотока при захвате микрофона. */
    private readonly streamConstraintsMic: MediaStreamConstraints = {
        audio: { noiseSuppression: true, echoCancellation: true, autoGainControl: true }, video: false
    };

    /** Настройки медиапотока при захвате видеоизображения экрана. */
    private captureConstraintsDisplay: Map<string, MediaStreamConstraints>;

    /** Настройки медиапотока при захвате изображения веб-камеры. */
    private captureConstraintsCam: Map<string, MediaStreamConstraints>;

    private audioContext: AudioContext = this.createAudioContext();

    private micAudioProcessing: MicAudioProcessing;

    constructor(_ui: UI, _room: Room)
    {
        console.debug("[UserMedia] > ctor");

        this.ui = _ui;
        this.room = _room;

        this.captureConstraintsDisplay = this.prepareCaptureDisplayConstraints();
        this.captureConstraintsCam = this.prepareCaptureCamConstraints();

        this.micAudioProcessing = new MicAudioProcessing(this.audioContext, this.ui);

        this.handleDevicesList();
        this.handleChoosingCamDevices();
        this.handleButtons();
    }

    /** Создать контекст для Web Audio API. */
    private createAudioContext(): AudioContext
    {
        window.AudioContext = window.AudioContext // Default
            || window.webkitAudioContext;          // Workaround for Safari

        if (AudioContext)
        {
            return new AudioContext();
        }

        throw new UnsupportedError("Web Audio API is not supported by this browser.");
    }

    /** Подготовить список устройств и подключение обработчика событий изменения устройств. */
    private handleDevicesList(): void
    {
        void this.prepareDevices(true);
        void this.prepareDevices(false);

        navigator.mediaDevices.addEventListener("devicechange", async (event) =>
        {
            await this.prepareDevices(true);
            await this.prepareDevices(false);
        });
    }

    /** Подключение обработчика изменения выбора видеоустройства. */
    private handleChoosingCamDevices(): void
    {
        const devices = this.ui.camDevices;

        devices.addEventListener("change", () =>
        {
            const deviceId = devices.value;
            const stopBtnHidden = this.ui.buttons.get('stop-cam')!.hidden;

            // Необходимо отображать кнопку прекращения захвата, если устройство захвачено
            // и соотвественно отображать кнопку захвата, если выбранное устройство не захвачено.
            if ((this.capturedVideoDevices.has(deviceId) && stopBtnHidden)
                || (!this.capturedVideoDevices.has(deviceId) && !stopBtnHidden))
            {
                this.ui.toggleCamButtons();
            }
        });
    }

    /** Подключить обработчики к кнопкам. */
    private handleButtons(): void
    {
        // Кнопка захвата микрофона.
        const btn_getMic = this.ui.buttons.get('get-mic')!;
        btn_getMic.addEventListener('click', async () =>
        {
            btn_getMic.disabled = true;
            await this.handleGetMic();
            btn_getMic.disabled = false;
        });

        // Кнопка остановки захвата микрофона.
        const btn_stopMic = this.ui.buttons.get("stop-mic")!;
        btn_stopMic.addEventListener("click", () =>
        {
            this.handleStopMic();
        });

        // Кнопка выключения микрофона (пауза).
        const btn_pauseMic = this.ui.buttons.get('pause-mic')!;
        btn_pauseMic.addEventListener('click', () =>
        {
            this.pauseMic();
        });

        // Кнопка включения микрофона (снятие с паузы).
        const btn_unpauseMic = this.ui.buttons.get('unpause-mic')!;
        btn_unpauseMic.addEventListener('click', () =>
        {
            this.unpauseMic();
        });

        // Кнопка захвата веб-камеры.
        const btn_getCam = this.ui.buttons.get('get-cam')!;
        btn_getCam.addEventListener('click', async () =>
        {
            btn_getCam.disabled = true;
            await this.handleGetCam();
            btn_getCam.disabled = false;
        });

        // Кнопка остановки захвата веб-камеры.
        const btn_stopCam = this.ui.buttons.get("stop-cam")!;
        btn_stopCam.addEventListener("click", () =>
        {
            const deviceId = this.ui.currentCamDevice;
            this.handleStopCam(deviceId);
        });

        // Кнопка остановки захвата всех веб-камер.
        const btn_stopAllCams = this.ui.buttons.get("stop-all-cams")!;
        btn_stopAllCams.addEventListener("click", () =>
        {
            for (const deviceId of this.capturedVideoDevices)
            {
                this.handleStopCam(deviceId);
            }
        });

        // Кнопка захвата изображения экрана компьютера.
        const btn_getDisplay = this.ui.buttons.get('get-display')!;
        btn_getDisplay.addEventListener('click', async () =>
        {
            btn_getDisplay.disabled = true;
            await this.handleGetDisplay();
            btn_getDisplay.disabled = false;
        });

        // Кнопка остановки захвата изображения экрана.
        const btn_stopDisplay = this.ui.buttons.get("stop-display")!;
        btn_stopDisplay.addEventListener("click", () =>
        {
            this.handleStopDisplay();
        });

        // Кнопка дополнительных настроек микрофона.
        const btn_showMicOptions = this.ui.buttons.get('show-mic-options')!;
        btn_showMicOptions.addEventListener('click', () =>
        {
            const micOptions = this.ui.micOptions;
            micOptions.hidden = !micOptions.hidden;

            this.handleVolumeMeter();
        });

        // Кнопка прослушивания микрофона в панели доп. настрок микрофона.
        const btn_toggleMicOutput = this.ui.buttons.get('toggle-mic-output')!;
        btn_toggleMicOutput.addEventListener('click', () =>
        {
            const isOutputDisabled = (btn_toggleMicOutput.innerText === "Вкл. прослушивание микрофона");
            btn_toggleMicOutput.innerText = isOutputDisabled ? "Выкл. прослушивание микрофона" : "Вкл. прослушивание микрофона";
            btn_toggleMicOutput.className = isOutputDisabled ? "btn-mic background-red" : "btn-mic background-darkgreen";

            this.handleMicOutput();
        });

        this.ui.checkboxEnableNoiseGate.addEventListener("click", () =>
        {
            this.handleMicNoiseGate();
        });

        this.ui.checkboxEnableManualGainControl.addEventListener("click", () =>
        {
            this.handleMicManualGain();
        });

        const getMicAgain = () =>
        {
            // Если микрофон уже захвачен.
            if (!btn_stopMic.hidden)
            {
                btn_stopMic.click();
                btn_getMic.click();
            }
        };

        this.ui.checkboxEnableNoiseSuppression.addEventListener("click", () =>
        {
            getMicAgain();
        });

        this.ui.checkboxEnableEchoCancellation.addEventListener("click", () =>
        {
            getMicAgain();
        });

        this.ui.checkboxEnableAutoGainControl.addEventListener("click", () =>
        {
            getMicAgain();
        });
    }

    /** Обработка нажатия на кнопку "Захватить микрофон". */
    private async handleGetMic(): Promise<void>
    {
        if (!this.room.isAllowedToSpeak)
        {
            return;
        }

        let deviceId = this.ui.currentMicDevice;

        console.debug("[UserMedia] > handleGetMic", deviceId);

        const constraints = this.streamConstraintsMic;
        (constraints.audio as MediaTrackConstraints).deviceId = { ideal: deviceId };

        // Применяем настройки шумоподавления и эхоподавления.
        (constraints.audio as MediaTrackConstraints).noiseSuppression = this.ui.checkboxEnableNoiseSuppression.checked;
        (constraints.audio as MediaTrackConstraints).echoCancellation = this.ui.checkboxEnableEchoCancellation.checked;
        (constraints.audio as MediaTrackConstraints).autoGainControl = this.ui.checkboxEnableAutoGainControl.checked;

        // Это происходит на Chrome, при первом заходе на страницу
        // когда нет прав на получение Id устройства.
        if (deviceId == "")
        {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const device = devices.find((val) =>
            {
                if (val.kind == "audioinput")
                {
                    return val;
                }
            });

            if (device)
            {
                const groupId = device.groupId;
                (constraints.audio as MediaTrackConstraints).groupId = { ideal: groupId };
            }
        }

        try
        {
            // Захват микрофона.
            deviceId = await this.getUserMedia(constraints, deviceId);

            // Выберем в списке устройств захваченный микрофон.
            this.ui.micDevices.value = deviceId;

            // Переключим кнопки для захвата микрофона.
            this.ui.buttons.get('pause-mic')!.hidden = false;
            this.ui.toggleMicButtons();
        }
        catch (error) // В случае ошибки.
        {
            console.error("[UserMedia] > getUserMedia (mic) error:", error as DOMException);
        }
    }

    /** Обработка нажатия на кнопку "Прекратить захват микрофона". */
    private handleStopMic(): void
    {
        const track = this.streams.get("main")!.getAudioTracks()[0];

        track.stop();
        this.removeEndedTrack("main", track);
    }

    /** Обработка нажатия на кнопку "Захватить веб-камеру". */
    private async handleGetCam(): Promise<void>
    {
        if (!this.room.isAllowedToSpeak)
        {
            return;
        }

        let deviceId = this.ui.currentCamDevice;

        console.debug("[UserMedia] > handleGetCam", deviceId);

        if (this.capturedVideoDevices.has(deviceId))
        {
            alert("Это видеоустройство уже захвачено.");
            return;
        }

        // Используем spread оператор для копирования объекта constraints.
        const constraints = { ...this.captureConstraintsCam.get(this.ui.currentCaptureSettingCam)! };
        (constraints.video as MediaTrackConstraints).deviceId = { ideal: deviceId };

        // Это происходит на Chrome, при первом заходе на страницу
        // когда нет прав на получение Id устройства.
        if (deviceId == "")
        {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const device = devices.find((val) =>
            {
                if (val.kind == "videoinput")
                {
                    return val;
                }
            });

            if (device)
            {
                const groupId = device.groupId;
                (constraints.video as MediaTrackConstraints).groupId = { ideal: groupId };
            }
        }

        try
        {
            deviceId = await this.getUserMedia(constraints, deviceId);

            // Выберем в списке устройств захваченную вебку.
            this.ui.camDevices.value = deviceId;

            // Переключаем кнопки захвата вебки.
            this.ui.toggleCamButtons();
        }
        catch (error)
        {
            console.error("[UserMedia] > getUserMedia (cam) error:", error as DOMException);
        }
    }

    /** Обработка нажатия на кнопку "Прекратить захват веб-камеры". */
    private handleStopCam(deviceId: string): void
    {
        console.debug("[UserMedia] > handleStopCam", deviceId);

        // Если это устройство не числится, как захваченное.
        if (!this.capturedVideoDevices.has(deviceId))
        {
            return;
        }

        let streamId = deviceId;
        if (streamId == this.mainStreamVideoDeviceId)
        {
            streamId = "main";
        }

        const stream = this.streams.get(streamId);

        if (!stream)
        {
            return;
        }

        const track = stream.getVideoTracks()[0];

        // Останавливаем видеодорожку.
        track.stop();

        // Удаляем дорожку.
        this.removeEndedTrack(streamId, track);

        // Отметим, что устройство deviceId больше не занято.
        this.capturedVideoDevices.delete(deviceId);
    }

    /** Обработка нажатия на кнопку "Демонстрация экрана". */
    private async handleGetDisplay(): Promise<void>
    {
        if (!this.room.isAllowedToSpeak)
        {
            return;
        }

        try
        {
            // Захват изображения с экрана компьютера.
            await this.getDisplayMedia();

            // Переключаем кнопки захвата экрана.
            this.ui.toggleDisplayButtons();
        }
        catch (error)
        {
            console.error("[UserMedia] > getDisplayMedia error:", error as DOMException);
        }
    }

    /** Обработка нажатия на кнопку "Прекратить захват экрана". */
    private handleStopDisplay(): void
    {
        const stream = this.streams.get("display")!;

        for (const track of stream.getTracks())
        {
            track.stop();
        }

        this.removeEndedDisplayStream();
    }

    /**
     * Получение потока видео (веб-камера) или аудио (микрофон).
     * @returns deviceId - Id захваченного устройства.
    */
    private async getUserMedia(
        streamConstraints: MediaStreamConstraints,
        deviceId: string
    ): Promise<string>
    {
        console.debug("[UserMedia] > getUserMedia", streamConstraints);
        const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia(streamConstraints);

        // Обновим список устройств после получения прав
        // и получим настоящий Id захваченного устройства.
        deviceId = await this.updateDevicesAfterGettingPermissions(
            mediaStream,
            deviceId,
            streamConstraints.audio ? true : false
        );

        console.debug("[UserMedia] > getUserMedia success:", deviceId, mediaStream);

        // Если это микрофон.
        if (streamConstraints.audio)
        {
            const proccessedStream = (await this.handleMicAudioProcessing(mediaStream)).clone();

            await this.handleMediaStream("main", proccessedStream);

            console.debug("[UserMedia] > Captured mic settings:", mediaStream.getAudioTracks()[0].getSettings());
            return deviceId;
        }

        // ---------------------------------------
        // Иначе это веб-камера (видеоустройство).
        // ---------------------------------------

        // Запишем, что устройство deviceId занято, для исключения дубликатов.
        this.capturedVideoDevices.add(deviceId);

        // Определим, нужен ли дополнительный видеоэлемент под вебку.
        if (this.isNeededSecondaryVideoStream())
        {
            this.ui.addSecondaryVideo("local", deviceId, this.ui.usernames.get("local")!);
            await this.handleMediaStream(deviceId, mediaStream, deviceId);
        }
        else
        {
            await this.handleMediaStream("main", mediaStream, deviceId);

            // Запишем идентификатор видеоустройства.
            this.mainStreamVideoDeviceId = deviceId;
        }

        return deviceId;
    }

    /**
     * Обновление списка устройств после получения прав в соответствии с браузером (Firefox или Chrome).
     * @returns deviceId - настоящий Id захваченного устройства.
     */
    private async updateDevicesAfterGettingPermissions(
        mediaStream: MediaStream,
        deviceId: string,
        isAudioDevice: boolean
    ): Promise<string>
    {
        // Обновим списки устройств, после того как мы получили права после запроса getUserMedia.
        // У Firefox у нас уже были Id устройств, осталось обновить список с полученными названиями устройств обоих видов.
        if (deviceId != "")
        {
            await this.refreshDevicesLabels(true);
            await this.refreshDevicesLabels(false);
        }
        // Chrome изначально не сообщает количество устройств, а также не сообщает их Id (возвращает пустой Id).
        // Поэтому если это Chrome, то в эту функцию был передан пустой deviceId.
        // Поэтому для Chrome вручную обновим списки устройств только определенного типа (video или audio),
        // поскольку права выдаются только на тот тип, что был захвачен.
        else if (deviceId == "" && isAudioDevice)
        {
            await this.prepareDevices(true);
        }
        else if (deviceId == "" && !isAudioDevice)
        {
            await this.prepareDevices(false);
        }

        // Получаем настоящий Id захваченного устройства.
        deviceId = mediaStream.getTracks()[0].getSettings().deviceId!;

        const isPoorDeviceId = (id: string) =>
        {
            return (id == "" || id == "default" || id == "communications");
        };

        // Если нас не устраивает Id захваченного устройства.
        // Попробуем выяснить его через groupId.
        if (isPoorDeviceId(deviceId))
        {
            const groupId = mediaStream.getTracks()[0].getSettings().groupId!;
            const kind = isAudioDevice ? "audioinput" : "videoinput";

            const devices = await navigator.mediaDevices.enumerateDevices();
            const device = devices.find((val) =>
            {
                if (val.kind == kind
                    && val.groupId == groupId
                    && !isPoorDeviceId(val.deviceId))
                {
                    return val;
                }
            });

            if (device)
            {
                deviceId = device.deviceId;
            }
        }

        return deviceId;
    }

    /** Нужен ли дополнительный видеоэлемент под веб-камеру. */
    private isNeededSecondaryVideoStream(): boolean
    {
        const mainStream = this.streams.get("main");
        if (mainStream)
        {
            return (mainStream.getVideoTracks().length > 0);
        }
        return false;
    }

    /** Захват видео с экрана юзера. */
    private async getDisplayMedia(): Promise<void>
    {
        console.debug("[UserMedia] > getDisplayMedia",
            this.captureConstraintsDisplay.get(this.ui.currentCaptureSettingDisplay));

        // Захват экрана.
        const mediaStream: MediaStream = await navigator.mediaDevices
            .getDisplayMedia(this.captureConstraintsDisplay
                .get(this.ui.currentCaptureSettingDisplay));

        console.debug("[UserMedia] > getDisplayMedia success:", mediaStream);

        this.ui.addSecondaryVideo("local", "display", this.ui.usernames.get("local")!);

        await this.handleMediaDisplayStream(mediaStream);
    }

    /**
     * Обработка медиапотока с вебкой или микрофоном.
     * @param videoDeviceId - опциональный параметр, Id захваченного видеоустройства.
     */
    private async handleMediaStream(
        streamId: string,
        mediaStream: MediaStream,
        videoDeviceId?: string
    ): Promise<void>
    {
        // Вытягиваем новую дорожку.
        const newTrack = mediaStream.getTracks()[0];

        // Подключаем обработчик закончившейся дорожки.
        this.handleEndedTrack(streamId, newTrack, videoDeviceId);

        let stream = this.streams.get(streamId);
        const video = this.ui.getVideo("local", streamId)!;

        // Если такой поток есть.
        if (stream)
        {
            const streamWasActive = stream.active;

            // Добавляем дорожку.
            stream.addTrack(newTrack);

            // Перезагружаем видеоэлемент. Это необходимо, на тот случай,
            // если до этого из стрима удалили все дорожки и стрим стал неактивным,
            // а при удалении видеодорожки (и она была последней при удалении) вызывали load(),
            // чтобы убрать зависнувший последний кадр.
            // Иначе баг на Chrome: если в стриме только аудиодорожка,
            // то play/pause на видеоэлементе не будут работать, а звук будет все равно идти.
            if (!streamWasActive)
            {
                video.load();
            }
        }
        else // Если создаем его впервые.
        {
            stream = new MediaStream([newTrack]);

            // Запоминаем поток.
            this.streams.set(streamId, stream);
        }

        // Подключаем медиапоток к HTML-видеоэлементу.
        if (!video.srcObject)
        {
            video.srcObject = stream;
        }

        // Так как добавили новую дорожку, включаем отображение элементов управления.
        // Но регулятор громкости не показываем.
        this.ui.showControls(video.plyr, false);

        // Отправляем всем новую медиадорожку.
        await this.room.addMediaStreamTrack(streamId, newTrack);

        if (newTrack.kind == "video")
        {
            // Переключаем метку на видео.
            this.ui.toggleVideoLabels(
                this.ui.getCenterVideoLabel("local", streamId)!,
                this.ui.getVideoLabel("local", streamId)!
            );

            // Воспроизведем звук захвата видеодорожки.
            this.ui.playSound(UiSound.videoOn);
        }
    }

    /** Обработка медиапотока (захват экрана). */
    private async handleMediaDisplayStream(stream: MediaStream): Promise<void>
    {
        const video = this.ui.getVideo("local", "display");

        if (!video)
        {
            return;
        }

        // Запоминаем поток.
        this.streams.set("display", stream);

        // Подключаем медиапоток к HTML-видеоэлементу.
        if (!video.srcObject)
        {
            video.srcObject = stream;
        }

        // Так как добавили новую дорожку, включаем отображение элементов управления.
        // Но регулятор громкости не показываем.
        this.ui.showControls(video.plyr, false);

        // Переключаем метку на видео.
        this.ui.toggleVideoLabels(
            this.ui.getCenterVideoLabel("local", "display")!,
            this.ui.getVideoLabel("local", "display")!
        );

        for (const newTrack of stream.getTracks())
        {
            // Подключаем обработчик закончившейся дорожки.
            this.handleEndedTrack("display", newTrack);

            // Отправим всем новую медиадорожку.
            await this.room.addMediaStreamTrack("display", newTrack);
        }

        // Воспроизведем звук захвата видеодорожки.
        this.ui.playSound(UiSound.videoOn);
    }

    /** Обработка закончившейся (ended) дорожки. */
    private handleEndedTrack(
        streamId: string,
        track: MediaStreamTrack,
        videoDeviceId?: string
    ): void
    {
        track.addEventListener('ended', () =>
        {
            if (streamId == "display" && this.streams.has(streamId))
            {
                this.removeEndedDisplayStream();
            }
            else
            {
                // Удалим дорожку.
                this.removeEndedTrack(streamId, track);

                // Отметим, что устройство deviceId больше не занято.
                if (videoDeviceId)
                {
                    this.capturedVideoDevices.delete(videoDeviceId);
                }
            }
        });
    }

    /** Удалить закончившуюся (ended) дорожку. */
    private removeEndedTrack(streamId: string, track: MediaStreamTrack)
    {
        console.debug("[UserMedia] > removeEndedTrack", streamId, track);

        this.room.removeMediaStreamTrack(track.id);

        // Если это дорожка основного потока (main).
        if (streamId == "main")
        {
            this.removeTrackFromMainStream(streamId, track);
        }
        else // Иначе необходимо удалить дорожку неосновного медиапотока.
        {
            this.removeTrackFromSecondaryStream(streamId);
        }
    }

    /** Удалить закончившийся поток display - экран компьютера: видео и аудио (если есть). */
    private removeEndedDisplayStream()
    {
        console.debug("[UserMedia] > removeEndedDisplayStream");

        const stream = this.streams.get("display")!;
        for (const track of stream.getTracks())
        {
            this.room.removeMediaStreamTrack(track.id);
        }


        this.ui.removeVideoItem(this.ui.getVideoItem("local", "display")!);
        this.streams.delete("display");

        // Переключаем кнопку захвата экрана.
        this.ui.toggleDisplayButtons();

        // Воспроизводим звук.
        this.ui.playSound(UiSound.videoOff);
    }

    /** Удалить медиадорожку из локального основного стрима. */
    private removeTrackFromMainStream(streamId: string, track: MediaStreamTrack): void
    {
        console.debug("[UserMedia] > removeTrackFromMainStream", track);

        const stream = this.streams.get("main")!;
        const video = this.ui.getVideo("local", "main")!;

        stream.removeTrack(track);

        if (track.kind == "video")
        {
            // Сбрасываем видео объект.
            video.load();

            // Переключаем видимость текстовых меток.
            this.ui.toggleVideoLabels(
                this.ui.getCenterVideoLabel("local", streamId)!,
                this.ui.getVideoLabel("local", streamId)!
            );

            // Воспроизводим звук.
            this.ui.playSound(UiSound.videoOff);

            // Очищаем идентификатор видеоустройства, захваченного в главном медиапотоке.
            this.mainStreamVideoDeviceId = "";

            // И переключаем кнопку захвата веб-камеры.
            this.ui.toggleCamButtons();
        }
        else
        {
            // Поскольку дорожка микрофона была удалена,
            // то скрываем кнопки включения/выключения микрофона.
            this.ui.hideMicPauseButtons();

            // И переключаем кнопку захвата микрофона.
            this.ui.toggleMicButtons();

            // Удалим ноду с микрофонным потоком.
            this.micAudioProcessing.destroyMicNode();
        }

        // Если дорожек не осталось, выключаем элементы управления плеера.
        if (stream.getTracks().length == 0)
        {
            this.ui.hideControls(video.plyr);
        }
    }

    /** Удалить медиадорожку из локального неосновного стрима. */
    private removeTrackFromSecondaryStream(streamId: string): void
    {
        // Удаляем видеоэлемент.
        this.ui.removeVideoItem(this.ui.getVideoItem("local", streamId)!);

        // Удаляем из списка потоков.
        this.streams.delete(streamId);

        // Воспроизводим звук.
        this.ui.playSound(UiSound.videoOff);

        // И переключаем кнопку захвата веб-камеры.
        this.ui.toggleCamButtons();
    }

    /** Выключить микрофон (поставить на паузу). */
    private pauseMic(): void
    {
        console.debug("[UserMedia] > pauseMic");

        const micTrack: MediaStreamTrack = this.streams.get("main")!.getAudioTracks()[0];

        this.room.pauseMediaStreamTrack(micTrack.id);

        this.ui.toggleMicPauseButtons();

        this.ui.playSound(UiSound.micOff);
    }

    /** Включить микрофон (снять с паузы). */
    private unpauseMic(): void
    {
        console.debug("[UserMedia] > unpauseMic");

        const micTrack: MediaStreamTrack = this.streams.get("main")!.getAudioTracks()[0];

        this.room.resumeMediaStreamTrack(micTrack.id);

        this.ui.toggleMicPauseButtons();

        this.ui.playSound(UiSound.micOn);
    }

    private createDisplayConstraints(
        width: number,
        height: number,
        frameRate: number
    ): MediaStreamConstraints
    {
        const result: MediaStreamConstraints = {
            video: {
                frameRate,
                width,
                height
            },
            audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
        };

        return result;
    }

    private createCamConstraints(
        width: number,
        height: number,
        frameRate?: number
    ): MediaStreamConstraints
    {
        const result: MediaStreamConstraints = {
            video: { width, height, frameRate },
            audio: false
        };

        return result;
    }

    /** Подготовить опции с разрешениями захватываемого видеоизображения. */
    private prepareCaptureDisplayConstraints(): Map<string, MediaStreamConstraints>
    {
        const _constraints = new Map<string, MediaStreamConstraints>();

        const constraints1440p60 = this.createDisplayConstraints(2560, 1440, 60);
        const constraints1440p30 = this.createDisplayConstraints(2560, 1440, 30);
        const constraints1440p5 = this.createDisplayConstraints(2560, 1440, 5);

        const constraints1080p60 = this.createDisplayConstraints(1920, 1080, 60);
        const constraints1080p30 = this.createDisplayConstraints(1920, 1080, 30);
        const constraints1080p5 = this.createDisplayConstraints(1920, 1080, 5);

        const constraints900p60 = this.createDisplayConstraints(1600, 900, 60);
        const constraints900p30 = this.createDisplayConstraints(1600, 900, 30);
        const constraints900p5 = this.createDisplayConstraints(1600, 900, 5);

        const constraints720p60 = this.createDisplayConstraints(1280, 720, 60);
        const constraints720p30 = this.createDisplayConstraints(1280, 720, 30);
        const constraints720p5 = this.createDisplayConstraints(1280, 720, 5);

        const constraints480p30 = this.createDisplayConstraints(854, 480, 30);
        const constraints360p30 = this.createDisplayConstraints(640, 360, 30);
        const constraints240p30 = this.createDisplayConstraints(426, 240, 30);
        const constraints144p30 = this.createDisplayConstraints(256, 144, 30);

        const defaultConstraints: MediaStreamConstraints = {
            video: { frameRate: 30 },
            audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
        };

        const settingsDisplay = this.ui.captureSettingsDisplay;


        _constraints.set('default', defaultConstraints);
        this.ui.addOptionToSelect(settingsDisplay, 'По умолчанию', 'default');
        this.ui.addSeparatorToSelect(settingsDisplay);

        // 1440
        _constraints.set('1440p@60', constraints1440p60);
        this.ui.addOptionToSelect(settingsDisplay, '2560x1440@60', '1440p@60');

        _constraints.set('1440p@30', constraints1440p30);
        this.ui.addOptionToSelect(settingsDisplay, '2560x1440@30', '1440p@30');

        _constraints.set('1440p@5', constraints1440p5);
        this.ui.addOptionToSelect(settingsDisplay, '2560x1440@5', '1440p@5');

        this.ui.addSeparatorToSelect(settingsDisplay);

        // 1080
        _constraints.set('1080p@60', constraints1080p60);
        this.ui.addOptionToSelect(settingsDisplay, '1920x1080@60', '1080p@60');

        _constraints.set('1080p@30', constraints1080p30);
        this.ui.addOptionToSelect(settingsDisplay, '1920x1080@30', '1080p@30');

        _constraints.set('1080p@5', constraints1080p5);
        this.ui.addOptionToSelect(settingsDisplay, '1920x1080@5', '1080p@5');

        this.ui.addSeparatorToSelect(settingsDisplay);

        // 900
        _constraints.set('900p@60', constraints900p60);
        this.ui.addOptionToSelect(settingsDisplay, '1600x900@60', '900p@60');

        _constraints.set('900p@30', constraints900p30);
        this.ui.addOptionToSelect(settingsDisplay, '1600x900@30', '900p@30');

        _constraints.set('900p@5', constraints900p5);
        this.ui.addOptionToSelect(settingsDisplay, '1600x900@5', '900p@5');

        this.ui.addSeparatorToSelect(settingsDisplay);

        // 720
        _constraints.set('720p@60', constraints720p60);
        this.ui.addOptionToSelect(settingsDisplay, '1280x720@60', '720p@60');

        _constraints.set('720p@30', constraints720p30);
        this.ui.addOptionToSelect(settingsDisplay, '1280x720@30', '720p@30');

        _constraints.set('720p@5', constraints720p5);
        this.ui.addOptionToSelect(settingsDisplay, '1280x720@5', '720p@5');

        this.ui.addSeparatorToSelect(settingsDisplay);

        // 480
        _constraints.set('480p@30', constraints480p30);
        this.ui.addOptionToSelect(settingsDisplay, '854x480@30', '480p@30');

        this.ui.addSeparatorToSelect(settingsDisplay);

        // 360
        _constraints.set('360p@30', constraints360p30);
        this.ui.addOptionToSelect(settingsDisplay, '640x360@30', '360p@30');

        this.ui.addSeparatorToSelect(settingsDisplay);

        // 240
        _constraints.set('240p@30', constraints240p30);
        this.ui.addOptionToSelect(settingsDisplay, '426x240@30', '240p@30');

        this.ui.addSeparatorToSelect(settingsDisplay);

        // 144
        _constraints.set('144p@30', constraints144p30);
        this.ui.addOptionToSelect(settingsDisplay, '256x144@30', '144p@30');

        for (const constraint of _constraints)
        {
            const currentFrameRate = Number((constraint[1].video as MediaTrackConstraintSet).frameRate);
            (constraint[1].video as MediaTrackConstraintSet).frameRate = currentFrameRate * 1.5;
        }

        return _constraints;
    }

    /** Подготовить опции с разрешениями захватываемого изображения с веб-камеры. */
    private prepareCaptureCamConstraints(): Map<string, MediaStreamConstraints>
    {
        const _constraints = new Map<string, MediaStreamConstraints>();

        const constraints1440p60 = this.createCamConstraints(2560, 1440, 60);
        const constraints1440p30 = this.createCamConstraints(2560, 1440, 30);
        const constraints1440p15 = this.createCamConstraints(2560, 1440, 15);
        const constraints1440p = this.createCamConstraints(2560, 1440);

        const constraints1080p60 = this.createCamConstraints(1920, 1080, 60);
        const constraints1080p30 = this.createCamConstraints(1920, 1080, 30);
        const constraints1080p15 = this.createCamConstraints(1920, 1080, 15);
        const constraints1080p = this.createCamConstraints(1920, 1080);

        const constraints720p60 = this.createCamConstraints(1280, 720, 60);
        const constraints720p30 = this.createCamConstraints(1280, 720, 30);
        const constraints720p15 = this.createCamConstraints(1280, 720, 15);
        const constraints720p = this.createCamConstraints(1280, 720);

        const constraints480p60 = this.createCamConstraints(640, 480, 60);
        const constraints480p30 = this.createCamConstraints(640, 480, 30);
        const constraints480p15 = this.createCamConstraints(640, 480, 15);
        const constraints480p = this.createCamConstraints(640, 480);

        const constraints360p60 = this.createCamConstraints(480, 360, 60);
        const constraints360p30 = this.createCamConstraints(480, 360, 30);
        const constraints360p15 = this.createCamConstraints(480, 360, 15);
        const constraints360p = this.createCamConstraints(480, 360);

        const constraints240p60 = this.createCamConstraints(320, 240, 60);
        const constraints240p30 = this.createCamConstraints(320, 240, 30);
        const constraints240p15 = this.createCamConstraints(320, 240, 15);
        const constraints240p = this.createCamConstraints(320, 240);

        const defaultConstraints: MediaStreamConstraints = {
            video: {}, audio: false
        };

        const settingsCam = this.ui.captureSettingsCam;

        _constraints.set('default', defaultConstraints);
        this.ui.addOptionToSelect(settingsCam, 'По умолчанию', 'default');
        this.ui.addSeparatorToSelect(settingsCam);

        // 1440
        _constraints.set('1440p', constraints1440p);
        this.ui.addOptionToSelect(settingsCam, '2560x1440', '1440p');

        _constraints.set('1440p@60', constraints1440p60);
        this.ui.addOptionToSelect(settingsCam, '2560x1440@60', '1440p@60');

        _constraints.set('1440p@30', constraints1440p30);
        this.ui.addOptionToSelect(settingsCam, '2560x1440@30', '1440p@30');

        _constraints.set('1440p@15', constraints1440p15);
        this.ui.addOptionToSelect(settingsCam, '2560x1440@15', '1440p@15');

        this.ui.addSeparatorToSelect(settingsCam);

        // 1080
        _constraints.set('1080p', constraints1080p);
        this.ui.addOptionToSelect(settingsCam, '1920x1080', '1080p');

        _constraints.set('1080p@60', constraints1080p60);
        this.ui.addOptionToSelect(settingsCam, '1920x1080@60', '1080p@60');

        _constraints.set('1080p@30', constraints1080p30);
        this.ui.addOptionToSelect(settingsCam, '1920x1080@30', '1080p@30');

        _constraints.set('1080p@15', constraints1080p15);
        this.ui.addOptionToSelect(settingsCam, '1920x1080@15', '1080p@15');

        this.ui.addSeparatorToSelect(settingsCam);

        // 720
        _constraints.set('720p', constraints720p);
        this.ui.addOptionToSelect(settingsCam, '1280x720', '720p');

        _constraints.set('720p@60', constraints720p60);
        this.ui.addOptionToSelect(settingsCam, '1280x720@60', '720p@60');

        _constraints.set('720p@30', constraints720p30);
        this.ui.addOptionToSelect(settingsCam, '1280x720@30', '720p@30');

        _constraints.set('720p@15', constraints720p15);
        this.ui.addOptionToSelect(settingsCam, '1280x720@15', '720p@15');

        this.ui.addSeparatorToSelect(settingsCam);

        // 480
        _constraints.set('480p', constraints480p);
        this.ui.addOptionToSelect(settingsCam, '640x480', '480p');

        _constraints.set('480p@60', constraints480p60);
        this.ui.addOptionToSelect(settingsCam, '640x480@60', '480p@60');

        _constraints.set('480p@30', constraints480p30);
        this.ui.addOptionToSelect(settingsCam, '640x480@30', '480p@30');

        _constraints.set('480p@15', constraints480p15);
        this.ui.addOptionToSelect(settingsCam, '640x480@15', '480p@15');

        this.ui.addSeparatorToSelect(settingsCam);

        // 360
        _constraints.set('360p', constraints360p);
        this.ui.addOptionToSelect(settingsCam, '480x360', '360p');

        _constraints.set('360p@60', constraints360p60);
        this.ui.addOptionToSelect(settingsCam, '480x360@60', '360p@60');

        _constraints.set('360p@30', constraints360p30);
        this.ui.addOptionToSelect(settingsCam, '480x360@30', '360p@30');

        _constraints.set('360p@15', constraints360p15);
        this.ui.addOptionToSelect(settingsCam, '480x360@15', '360p@15');

        this.ui.addSeparatorToSelect(settingsCam);

        // 240
        _constraints.set('240p', constraints240p);
        this.ui.addOptionToSelect(settingsCam, '320x240', '240p');

        _constraints.set('240p@60', constraints240p60);
        this.ui.addOptionToSelect(settingsCam, '320x240@60', '240p@60');

        _constraints.set('240p@30', constraints240p30);
        this.ui.addOptionToSelect(settingsCam, '320x240@30', '240p@30');

        _constraints.set('240p@15', constraints240p15);
        this.ui.addOptionToSelect(settingsCam, '320x240@15', '240p@15');

        this.ui.addSeparatorToSelect(settingsCam);


        return _constraints;
    }

    /** Подготовить опции с устройствами-микрофонами. */
    private async prepareDevices(isMicDevices: boolean): Promise<void>
    {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();

        const devicesSelect = isMicDevices ? this.ui.micDevices : this.ui.camDevices;
        devicesSelect.length = 0;

        const kind = isMicDevices ? "audioinput" : "videoinput";

        for (const device of mediaDevices)
        {
            if (device.kind == kind
                && device.deviceId != "communications")
            {
                console.log("Обнаружено устройство: ", device);
                const kindDeviceLabel = isMicDevices ? "Микрофон" : "Веб-камера";

                let label = (device.label.length != 0) ? device.label : `${kindDeviceLabel} #${devicesSelect.length + 1}`;

                if (device.deviceId == "default")
                {
                    label = "Как в системе";
                }

                this.ui.addOptionToSelect(devicesSelect, label, device.deviceId);
            }
        }
    }

    /** Обновить названия с устройствами. */
    private async refreshDevicesLabels(isMicDevices: boolean): Promise<void>
    {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();

        const devicesSelect = isMicDevices ? this.ui.micDevices : this.ui.camDevices;

        for (const deviceOption of devicesSelect)
        {
            // Если нет Id устройства, то и название не обновить.
            if (deviceOption.value == "" || deviceOption.value == "default")
            {
                return;
            }

            // Ищем в mediaDevices устройство с таким же Id, как и в deviceOption
            const device = mediaDevices.find((val) =>
            {
                if (val.deviceId == deviceOption.value)
                {
                    return val;
                }
            });

            if (!device)
            {
                return;
            }

            const kindDeviceLabel = isMicDevices ? "Микрофон" : "Веб-камера";
            const label = (device.label.length != 0) ? device.label : `${kindDeviceLabel} #${devicesSelect.length + 1}`;
            deviceOption.innerText = label;
        }
    }

    // Если панель скрыта, то отключаем индикатор громкости, иначе подключаем.
    private handleVolumeMeter(): void
    {
        const micOptionsHidden = this.ui.micOptions.hidden;
        micOptionsHidden ? this.micAudioProcessing.disconnectVolumeMeter()
            : this.micAudioProcessing.connectVolumeMeter(this.ui.volumeMeterElem);
    }

    private handleMicOutput(): void
    {
        const btn_toggleMicOutput = this.ui.buttons.get('toggle-mic-output')!;
        const isOutputDisabled = (btn_toggleMicOutput.innerText === "Вкл. прослушивание микрофона");

        isOutputDisabled ? this.micAudioProcessing.stopListenOutput() : this.micAudioProcessing.listenOutput();
    }

    private handleMicNoiseGate(): void
    {
        this.ui.checkboxEnableNoiseGate.checked ?
            this.micAudioProcessing.connectNoiseGate() :
            this.micAudioProcessing.disconnectNoiseGate();
    }

    private handleMicManualGain(): void
    {
        this.ui.checkboxEnableManualGainControl.checked ?
            this.micAudioProcessing.connectGain() :
            this.micAudioProcessing.disconnectGain();
    }

    private async handleMicAudioProcessing(micStream: MediaStream): Promise<MediaStream>
    {
        // Проверяем, готова ли VolumeMeter, и если нет, то инициализируем эту ноду.
        if (!this.micAudioProcessing.isVolumeMeterReady)
        {
            await this.micAudioProcessing.initVolumeMeter();
        }

        // Проверяем, готов ли NoiseGate, и если нет, то инициализируем эту ноду.
        if (!this.micAudioProcessing.isNoiseGateReady)
        {
            await this.micAudioProcessing.initNoiseGate();
        }

        // Инициализируем ноду с микрофонным потоком для последующей обработки.
        await this.micAudioProcessing.initMicNode(micStream);

        this.handleVolumeMeter();
        this.handleMicOutput();
        this.handleMicNoiseGate();
        this.handleMicManualGain();

        return this.micAudioProcessing.getOutputStream();
    }
}