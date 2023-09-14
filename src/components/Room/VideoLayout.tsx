import React, { MouseEventHandler, useEffect, useState } from 'react';

import "./VideoLayout.css";

import { Button } from "@mui/material";
import { LuLayoutGrid } from "react-icons/lu";
import { NumericConstants as NC } from "../../utils/NumericConstants";
import { Tooltip } from '../Tooltip';
import { Video, VideoList } from './VideoCard';
import { MemoizedVideoLayoutContent } from "./VideoLayoutContent";
import { MemoizedVideoRibbonLayoutContent } from './VideoRibbonLayoutContent';

export const VideoLayout: React.FC = () =>
{
    const [viewRibbonLayout, setViewRibbonLayout] = useState<boolean>(false);

    const [videoList, setVideoList] = useState<VideoList>([{ id: '0', name: '1' }]);

    // Типо загрузили список с сервера.
    useEffect(() =>
    {
        console.debug("[VideoLayout] Loading data from API...");

        setVideoList((prev) =>
        {
            const arr: Video[] = [];
            for (let i = 0; i < arr.length; ++i)
            {
                arr.push({ id: `${prev.length + i}`, name: `${prev.length + i + NC.IDX_STEP}` });
            }
            return prev.concat(arr);
        });

        return () =>
        {
            setVideoList([{ id: '0', name: '1' }]);
        };

    }, []);

    const handleChangeLayout: MouseEventHandler = () =>
    {
        setViewRibbonLayout(!viewRibbonLayout);
    };

    return (
        <div id="video-layout">
            <Tooltip title="Сменить раскладку" placement="top">
                <Button className="change-layout-button" onClick={handleChangeLayout}>
                    <LuLayoutGrid className="change-layout-icon" />
                </Button>
            </Tooltip>
            <button className="debug-btn" onClick={() => { setVideoList(prev => [...prev, { id: `${prev.length + NC.IDX_STEP}`, name: "new" }]); }}>+1</button>
            <button className="debug-btn-2" onClick={() =>
            {
                setVideoList((prev) =>
                {
                    const arr: Video[] = [];
                    const TEN = 10;
                    for (let i = 0; i < TEN; ++i)
                    {
                        arr.push({ id: `${prev.length + i}`, name: `${prev.length + i + NC.IDX_STEP}` });
                    }
                    return prev.concat(arr);
                });
            }}>
                +10
            </button>
            {viewRibbonLayout ?
                <MemoizedVideoRibbonLayoutContent videoList={videoList} />
                : <MemoizedVideoLayoutContent videoList={videoList} />
            }
        </div>
    );
};
