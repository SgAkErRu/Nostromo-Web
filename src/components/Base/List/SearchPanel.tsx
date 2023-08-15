import { ChangeEventHandler, FC } from "react";
import { ReactDispatch } from "../../../Utils";
import { Input } from "../Input";
import "./SearchPanel.css";

interface SearchPanelProps extends React.HTMLAttributes<HTMLDivElement>
{
    filter: string;
    setFilter : ReactDispatch<string>;
}

export const SearchPanel : FC<SearchPanelProps> = ({filter, setFilter, className, ...props}) =>
{
    const handleFilterChange : ChangeEventHandler<HTMLInputElement> = (ev) =>
    {
        setFilter(ev.target.value);
    }

    return (
        <div className={`search-panel ${className ?? ""}`} {...props} >
            <span className="search-label text-wrap non-selectable">
                Поиск
            </span>
            <Input value={filter} onChange={handleFilterChange}/>
        </div>
    );
}
