import { ChangeEventHandler, FC, MouseEventHandler, useEffect, useRef, useState } from "react";
import "./TextEditDialog.css"
import { Input } from "../Base/Input";
import { FocusTrap } from "../Base/FocusTrap";
import { Button } from "@mui/material";

interface TextEditDialogProps
{
    isOpen: boolean;
    label: string;
    description?: string;
    hint? : string;
    value? : string;
    onValueConfirm : (newValue: string) => void;
    onClose : () => void;
}

export const TextEditDialog: FC<TextEditDialogProps> = ({ isOpen, label, description, hint, value, onValueConfirm, onClose}) =>
{
    const [editedValue, setEditedValue] = useState<string>("");
    
    const initialFocusRef = useRef<HTMLElement | null>(null);
    useEffect(() =>
    {
        if (isOpen)
        {
            initialFocusRef.current = document.activeElement as HTMLElement | null;
        }
        else
        {
            initialFocusRef.current?.focus();
        }
    }, [isOpen]);

    // Сброс редактируемого значения при повторном открытии окна
    useEffect(() =>
    {
        setEditedValue(value !== undefined ? value : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleValueChange : ChangeEventHandler<HTMLInputElement> = (ev) =>
    {
        setEditedValue(ev.target.value);
    }

    const handleValueSave : MouseEventHandler<HTMLButtonElement> = (ev) :void =>
    {
        onValueConfirm(editedValue);
    }

    const handleCancelClick : MouseEventHandler<HTMLElement> = () :void =>
    {
        onClose();
    }

    const stopEvent : MouseEventHandler<HTMLDivElement> = (ev) : void =>
    {
        ev.stopPropagation();
    }

    return (
        isOpen ?
            <FocusTrap>
                <div className="backdrop" onClick={handleCancelClick}>
                    <div onClick={stopEvent} className="text-edit-dialog-container">
                        <div className="text-edit-dialog-label">{label}</div>
                        {description !== undefined ? <div className="text-edit-dialog-description">{description}</div> : <></>}
                        <div className="text-edit-dialog-input-container">
                            <Input className="text-edit-dialog-input" onChange={handleValueChange} value={editedValue} />
                            <div className="text-edit-dialog-input-hint">
                                {hint}
                            </div>
                        </div>
                        <div className="text-edit-dialog-actions-container">
                            <Button onClick={handleCancelClick} color="warning">Отмена</Button>
                            <Button onClick={handleValueSave} color="primary">Сохранить</Button>
                        </div>
                    </div>
                </div>
            </FocusTrap>
        :
            <></>
    );
};
