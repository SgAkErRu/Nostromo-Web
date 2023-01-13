import { WorkerUrl } from "worker-url";

export class MicAudioProcessing
{
    private ctx: AudioContext;

    private volumeMeterNode?: AudioWorkletNode;

    private micNode?: MediaStreamAudioSourceNode;

    private noiseGeneratorNode: AudioBufferSourceNode;

    private noiseGeneratorGainNode: GainNode;

    private outputNodeDestination: MediaStreamAudioDestinationNode;

    private outputNode: MediaStreamAudioSourceNode;

    public isVolumeMeterReady = false;
    private isVolumeMeterConnected = false;
    private isMicListening = false;
    private isNoiseGenerating = false;

    constructor(ctx: AudioContext)
    {
        this.ctx = ctx;

        this.noiseGeneratorGainNode = this.ctx.createGain();
        this.noiseGeneratorGainNode.gain.value = 0.03;

        this.noiseGeneratorNode = this.initNoiseGenerator();
        this.noiseGeneratorNode.connect(this.noiseGeneratorGainNode);

        this.outputNodeDestination = this.ctx.createMediaStreamDestination();
        this.outputNode = this.ctx.createMediaStreamSource(this.outputNodeDestination.stream);
    }

    private initNoiseGenerator(): AudioBufferSourceNode
    {
        const sampleRate = this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, sampleRate, sampleRate);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; ++i)
        {
            channelData[i] = Math.random() * 2 - 1;
        }

        const noiseGeneratorNode = this.ctx.createBufferSource();
        noiseGeneratorNode.buffer = buffer;
        noiseGeneratorNode.loop = true;
        noiseGeneratorNode.start(0);

        return noiseGeneratorNode;
    }

    public async initVolumeMeter(meter: HTMLMeterElement): Promise<void>
    {
        const workletUrl = new WorkerUrl(new URL("./VolumeMeter.ts", import.meta.url), {
            name: "public/VolumeMeterWorklet", customPath: () =>
            {
                return new URL("VolumeMeterWorklet.js", window.location.origin);
            }
        });

        await this.ctx.audioWorklet.addModule(workletUrl);

        this.volumeMeterNode = new AudioWorkletNode(this.ctx, "volume-meter");

        this.volumeMeterNode.port.onmessage = ({ data }) =>
        {
            meter.value = data * 500;
        };

        this.isVolumeMeterReady = true;
    }

    public async initMicNode(stream: MediaStream): Promise<void>
    {
        this.micNode = this.ctx.createMediaStreamSource(stream);
        this.micNode.connect(this.outputNodeDestination);

        if (this.ctx.state != "running")
        {
            await this.ctx.resume();
        }
    }

    public destroyMicNode(): void
    {
        this.micNode?.disconnect();
        this.micNode = undefined;

        this.outputNode.disconnect();

        this.isVolumeMeterConnected = false;
        this.isMicListening = false;
        this.isNoiseGenerating = false;
    }

    public connectVolumeMeter()
    {
        if (this.micNode && this.volumeMeterNode && !this.isVolumeMeterConnected)
        {
            this.outputNode.connect(this.volumeMeterNode);
            this.isVolumeMeterConnected = true;
        }
    }

    public disconnectVolumeMeter()
    {
        if (this.micNode && this.volumeMeterNode && this.isVolumeMeterConnected)
        {
            this.outputNode.disconnect(this.volumeMeterNode);
            this.isVolumeMeterConnected = false;
        }
    }

    public listenMic(): void
    {
        if (this.micNode && !this.isMicListening)
        {
            this.outputNode.connect(this.ctx.destination);
            this.isMicListening = true;
        }
    }

    public stopListenMic(): void
    {
        if (this.micNode && this.isMicListening)
        {
            this.outputNode.disconnect(this.ctx.destination);
            this.isMicListening = false;
        }
    }

    public connectNoiseGenerator()
    {
        if (this.micNode && !this.isNoiseGenerating)
        {
            this.noiseGeneratorGainNode.connect(this.outputNodeDestination);
            this.isNoiseGenerating = true;
        }
    }

    public disconnectNoiseGenerator()
    {
        if (this.micNode && this.isNoiseGenerating)
        {
            this.noiseGeneratorGainNode.disconnect(this.outputNodeDestination);
            this.isNoiseGenerating = false;
        }
    }
}