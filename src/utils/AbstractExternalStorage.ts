export type AbstractListener = () => void;

export abstract class AbstractExternalStorage
{
    private m_listeners: AbstractListener[] = [];

    public addListener(listener: AbstractListener): void
    {
        this.m_listeners = [...this.m_listeners, listener];
    }

    public removeListener(listener: AbstractListener): void
    {
        this.m_listeners = this.m_listeners.filter(l => l !== listener);
    }

    public subscribe(listener: AbstractListener): () => void
    {
        this.addListener(listener);
        return () => { this.removeListener(listener); };
    }

    protected notifyListeners(): void
    {
        for (const listener of this.m_listeners)
        {
            listener();
        }
    }
}
