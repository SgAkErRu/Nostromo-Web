import "./Tooltip.css";

import { Tooltip as TooltipMui, TooltipProps } from "@mui/material";

type FallBackPlacement = "bottom" | "left" | "right" | "top";

interface ModTooltipProps extends TooltipProps
{
    offset?: number;
    fallbackPlacements?: FallBackPlacement[];
}

export const Tooltip: React.FC<ModTooltipProps> = ({ offset, fallbackPlacements, ...props }) =>
{
    const POPPER_OFFSET_SKIDDING = 0;
    const POPPER_OFFSET_DISTANCE = 12;

    return (
        <TooltipMui {...props} arrow enterTouchDelay={400} enterDelay={200}
            TransitionProps={props.TransitionProps ?? { timeout: 150 }}
            PopperProps={{
                popperOptions: {
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [POPPER_OFFSET_SKIDDING, offset ?? POPPER_OFFSET_DISTANCE]
                            },
                        },
                        {
                            name: "flip",
                            options: {
                                fallbackPlacements: fallbackPlacements
                                    ?? ["bottom", "top", "left", "right"],
                                padding: 0,
                            }
                        },
                        {
                            name: 'preventOverflow',
                            options: {
                                padding: 8,
                            },
                        },
                    ],
                },
            }} classes={{ tooltip: "tooltip", arrow: "tooltip-arrow" }} />
    );
};