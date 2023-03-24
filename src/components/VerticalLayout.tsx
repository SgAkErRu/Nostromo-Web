import React, { MouseEvent, ReactNode, useRef, useState } from "react";

import "./Header.css";
import "./VerticalLayout.css";

interface Params
{
    upperContainer: ReactNode;
    lowerContainer: ReactNode;
}
export const VerticalLayout: React.FC<Params> = ({ upperContainer, lowerContainer }) =>
{
    const lowerContainerRef = useRef<HTMLDivElement>(null);

    const [mouseY, setMouseY] = useState(0);
    const [resizing, setResizing] = useState(false);
    const [heightForLower, setHeightForLower] = useState("20%");
    const [cursorStyle, setCursorStyle] = useState("default");

    const onMouseDown = (event: MouseEvent) =>
    {
        setMouseY(event.clientY);
        setResizing(true);
        setCursorStyle("ns-resize");
    };

    const onMouseUp = (event: MouseEvent) =>
    {
        if (resizing)
        {
            setResizing(false);
            setCursorStyle("default");
        }
    };

    const onMouseMove = (event: MouseEvent) =>
    {
        if (resizing)
        {
            const newY = event.clientY;
            const diff = mouseY - newY;

            const newHeight = lowerContainerRef.current!.clientHeight + diff;
            setHeightForLower(String(newHeight) + "px");

            setMouseY(newY);
        }
    };

    return (
        <div className={resizing ? "vertical-layout non-selectable" : "vertical-layout"}
            style={{ cursor: cursorStyle }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            <div className="vl-upper-elem">{upperContainer}</div>
            <div className={resizing ? "vl-resizer-bar vl-resizer-bar-activated" : "vl-resizer-bar"} onMouseDown={onMouseDown}></div>
            <div className="vl-lower-elem" ref={lowerContainerRef} style={({ height: heightForLower })}>{lowerContainer}</div>
        </div>
    );
};