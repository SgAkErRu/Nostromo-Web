import { ChangeEventHandler, FC, KeyboardEventHandler, MouseEventHandler, useEffect, useState } from "react";
import "./TextEditDialog.css"
import { Input } from "../Base/Input";
import { FocusTrap } from "../Base/FocusTrap";
import { Button } from "@mui/material";
import { NEGATIVE_TAB_IDX } from "../../Utils";

interface TextEditDialogProps
{
    isOpen: boolean;
    label: string;
    description?: JSX.Element | string;
    hint? : string;
    value? : string;
    onValueConfirm : (newValue: string) => void;
    onClose : () => void;
}

export const TextEditDialog: FC<TextEditDialogProps> = ({ isOpen, label, description, hint, value, onValueConfirm, onClose}) =>
{
    const [editedValue, setEditedValue] = useState<string>("");

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

    const handleValueSave : MouseEventHandler<HTMLButtonElement> = () : void =>
    {
        onValueConfirm(editedValue);
    }

    const handleCancelClick : MouseEventHandler<HTMLElement> = () : void =>
    {
        onClose();
    }

    const stopEvent : MouseEventHandler<HTMLDivElement> = (ev) : void =>
    {
        ev.stopPropagation();
    }

    const handleCloseByEscape : KeyboardEventHandler<HTMLDivElement> = (ev) : void =>
    {
        if (ev.key === "Escape")
        {
            onClose();
        }
    }

    return (
        isOpen ?
            <div tabIndex={NEGATIVE_TAB_IDX} onKeyDown={handleCloseByEscape}>
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
            </div>
        :
            <></>
    );
};
