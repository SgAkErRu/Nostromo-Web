import { Dispatch, ReactEventHandler, SetStateAction } from "react";

export type ReactDispatch<T> = Dispatch<SetStateAction<T>>;

/** Получить время в формате 00:00:00 (24 часа). */
export const getTimestamp = (datetime: number): string =>
{
    const date = new Date(datetime);
    const currentDate = new Date();

    let timestamp = "";

    // Если это тот же день.
    if (date.getDate() === currentDate.getDate()
        && date.getMonth() === currentDate.getMonth()
        && date.getFullYear() === currentDate.getFullYear())
    {
        timestamp = date.toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });

        return timestamp;
    }
    else
    {
        timestamp = date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: '2-digit',
            minute: "2-digit",
            second: "numeric",
            hour12: false
        });
    }

    return timestamp;
};

export interface DateWrapper
{
    milliseconds : number;
}

export const getToggleFunc = (setState: Dispatch<SetStateAction<boolean>>) =>
{
    return () => { setState(prevState => !prevState); };
};

export const doNotHandleEvent: ReactEventHandler = (ev) =>
{
    ev.preventDefault();
    ev.stopPropagation();
};

export function isEmptyString(str: string): boolean
{
    const EMPTY_STRING_LEN = 0;
    return str.length === EMPTY_STRING_LEN;
}

/**
 * Переместить фокус от `currentFocus` к другому соседнему элементу.
 * У элемента `focusTarget`, к которому перемещают фокус, должен быть аттрибут `tabindex`.
 * @param currentFocus исходный элемент владеющий фокусом.
 * @param next если `true`, то фокус будет перемещен к *следующему* элементу, иначе к *предыдущему*.
 */
export function moveFocus(currentFocus: Element | null, next: boolean): void
{
    if (!currentFocus)
    {
        return;
    }

    let focusTarget = next
        ? currentFocus.nextElementSibling
        : currentFocus.previousElementSibling;

    while (focusTarget !== null
        && !focusTarget.hasAttribute('tabindex'))
    {
        focusTarget = next
            ? focusTarget.nextElementSibling
            : focusTarget.previousElementSibling;
    }

    if (focusTarget)
    {
        (focusTarget as HTMLElement).focus();
    }
}

/**
 * Переместить фокус в списке `list` к первому или последнему элементу.
 * У элемента списка `list`, к которому перемещают фокус, должен быть аттрибут `tabindex`.
 * @param list список, на элемент которого должен быть нацелен фокус.
 * @param begin если `true`, то фокус будет перемещен к *первому* элементу, иначе к *последнему*.
 */
export function moveFocusToListBoundary(list: Element | null, first: boolean): void
{
    if (!list)
    {
        return;
    }

    let focusTarget = first
        ? list.firstElementChild
        : list.lastElementChild;

    while (focusTarget !== null
        && !focusTarget.hasAttribute('tabindex'))
    {
        focusTarget = first
            ? focusTarget.nextElementSibling
            : focusTarget.previousElementSibling;
    }

    if (focusTarget)
    {
        (focusTarget as HTMLElement).focus();
    }
}

const BINARY_THOUSAND = 1024;

export const PrefixConstants = {
    KILO: BINARY_THOUSAND,
    MEGA: BINARY_THOUSAND * BINARY_THOUSAND,
    GIGA: BINARY_THOUSAND * BINARY_THOUSAND * BINARY_THOUSAND,
} as const;

export const ZERO_IDX = 0;

export const ZERO_TAB_IDX = 0;

export const NEGATIVE_TAB_IDX = -1;

export const FILE_SIZE_PRESCISSION = 3;

export const IDX_STEP = 1;

export const NOT_FOUND_IDX = -1;

export const MOUSE_EVENT_NONE_BTN = 0;

export function cloneObject<T>(obj: T): T
{
    return JSON.parse(JSON.stringify(obj)) as T;
}

export function isObjectAndNotArray(obj: object): boolean
{
    return typeof obj === "object" && !Array.isArray(obj);
}

export function overrideValues(target: object, override: object): void
{
    for (const keyStr in target)
    {
        const key = keyStr as keyof object;
        if (Object.hasOwn(override, key))
        {
            if (isObjectAndNotArray(target[key]) && isObjectAndNotArray(override[key]))
            {
                overrideValues(target[key], override[key]);
            }
            else
            {
                target[key] = override[key];
            }
        }
    }
}

export type AbstractListener = () => void;

export abstract class AbstractExternalStorage
{
    private listeners: AbstractListener[] = [];

    public addListener(listener: AbstractListener): void
    {
        this.listeners = [...this.listeners, listener];
    }

    public removeListener(listener: AbstractListener): void
    {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    public subscribe(listener: AbstractListener): () => void
    {
        this.addListener(listener);
        return () => { this.removeListener(listener); };
    }

    protected notifyListeners(): void
    {
        for (const listener of this.listeners)
        {
            listener();
        }
    }
}
