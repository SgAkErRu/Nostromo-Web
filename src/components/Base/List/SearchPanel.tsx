import React, { ChangeEventHandler } from "react";
import { Input } from "../Input";
import "./SearchPanel.css";

interface SearchPanelProps extends React.HTMLAttributes<HTMLDivElement>
{
    filter: string;
    onFilterChange: (value: string) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
    filter,
    onFilterChange,
    className,
    ...props
}) =>
{
    const handleFilterChange: ChangeEventHandler<HTMLInputElement> = (ev) =>
    {
        onFilterChange(ev.target.value);
    };

    return (
        <div className={`search-panel ${className ?? ""}`} {...props} >
            <span className="search-label text-wrap non-selectable">
                Поиск
            </span>
            <Input value={filter} onChange={handleFilterChange} />
        </div>
    );
};
