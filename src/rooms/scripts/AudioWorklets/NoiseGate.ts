export type NoiseGateOptions = {
    contextSampleRate: number;
};

export type NoiseGateParams = {
    threshold?: number;
    attack?: number;
    release?: number;
};

export class NoiseGate extends AudioWorkletProcessor
{
    /** Огибающая громкости сигнала. */
    private envelope = new Float32Array(128);

    /** Предыдущий уровень огибающей (амплитуда сигнала). */
    private prevLevel = 0.0;

    /** Весы шумового гейта (1 - ворота открыты, 0 - закрыты). */
    private weights = new Float32Array(128);

    /** Предыдущий вес гейта. */
    private prevWeight = 1.0;

    /** Сглаживающий коэффициент. */
    private smoothFactor = 0;

    /** Частота сэмплирования. */
    private sampleRate = 44100;

    /** Время в секундах за которое фильтр достигнет значения 1 - 1/e (при переходе от 0 до 1). */
    private timeConstant = 0.0025;

    /** Время в секундах для того, чтобы гейт полностью закрылся. */
    private attack = 0.05;

    /** Время в секундах для того, чтобы гейт полностью открылся. */
    private release = 0.05;

    /** Порог - уровень громкости в дБ, ниже которого звук не пропускать. */
    private threshold = -40;

    static get parameterDescriptors()
    {
        return [
            { name: "attack", defaultValue: 0.05, minValue: 0, maxValue: 0.3 },
            { name: "release", defaultValue: 0.05, minValue: 0, maxValue: 0.3 },
            { name: "threshold", defaultValue: -40, minValue: -100, maxValue: 0 }
        ];
    }

    constructor(options: AudioWorkletNodeOptions)
    {
        super();

        const contextSampleRate = (options.processorOptions as NoiseGateOptions).contextSampleRate;
        this.sampleRate = contextSampleRate;

        // Сглаживающий коэффициент.
        this.smoothFactor = this.calcSmoothFactor(this.timeConstant, this.sampleRate);
    }

    /** Вычислить сглаживающий коэффициент для плавности работы фильтра шумового порога. */
    private calcSmoothFactor(
        timeConstant: number,
        sampleRate: number
    ): number
    {
        return Math.exp(-1 / (sampleRate * timeConstant));
    }

    /** Вычислить огибающую для сигнала как квадрат амплитуды сигнала с экспоненциальным сглаживанием. */
    private calcEnvelope(data: Float32Array): void
    {
        const inverseSmoothFactor = 1 - this.smoothFactor;

        this.envelope[0] = this.smoothFactor * this.prevLevel +
            inverseSmoothFactor * Math.pow(data[0], 2);

        for (let i = 1; i < data.length; ++i)
        {
            this.envelope[i] = this.smoothFactor * this.envelope[i - 1] +
                inverseSmoothFactor * Math.pow(data[i], 2);
        }

        this.prevLevel = this.envelope[this.envelope.length - 1];
    }

    private toDecibel(powerLevel: number)
    {
        return 10 * Math.log10(powerLevel);
    }

    private calcWeights(): void
    {
        let attackSteps = 1;
        let releaseSteps = 1;
        let attackLossPerStep = 1.0;
        let releaseGainPerStep = 1.0;

        if (this.attack > 0)
        {
            attackSteps = Math.ceil(this.sampleRate * this.attack);
            attackLossPerStep = 1 / attackSteps;
        }

        if (this.release > 0)
        {
            releaseSteps = Math.ceil(this.sampleRate * this.release);
            releaseGainPerStep = 1 / releaseSteps;
        }

        let envelopeValueInDecibel = 0;
        let weight = 0;

        for (let i = 0; i < this.envelope.length; ++i)
        {
            envelopeValueInDecibel = this.toDecibel(2 * this.envelope[i]);

            if (envelopeValueInDecibel < this.threshold)
            {
                weight = this.prevWeight - attackLossPerStep;
                this.weights[i] = Math.max(weight, 0);
            }
            else
            {
                weight = this.prevWeight + releaseGainPerStep;
                this.weights[i] = Math.min(weight, 1);
            }

            this.prevWeight = this.weights[i];
        }
    }

    public process(
        inputs: Float32Array[][],
        outputs: Float32Array[][],
        parameters: Record<string, Float32Array>
    ): boolean
    {
        this.attack = parameters.attack[0];
        this.release = parameters.release[0];
        this.threshold = parameters.threshold[0];

        const input = inputs[0];
        const output = outputs[0];

        const inputFirstChannelData = input[0];

        if (inputFirstChannelData === undefined)
        {
            return false;
        }

        this.calcEnvelope(inputFirstChannelData);
        this.calcWeights();

        for (let channel = 0; channel < output.length; ++channel)
        {
            for (let i = 0; i < output[channel].length; ++i)
            {
                output[channel][i] = input[channel][i] * this.weights[i];
            }
        }

        return true;
    }
}

registerProcessor("noise-gate", NoiseGate);