import { FC, MouseEventHandler, memo, useCallback, useRef, useState } from "react";
import { ElementSize, Video, VideoCard, VideoList, calculateVideoCardSize } from "./VideoCard";
import "./VideoRibbonLayoutContent.css";
import { NOT_FOUND_IDX, ZERO_IDX } from "../../Utils";
import { useResizeDetector } from "react-resize-detector";

interface VideoRibbonLayoutContentProps
{
    videoList: VideoList;
}

const DIMENSIONS_COUNT = 1;

const VideoRibbonLayoutContent: FC<VideoRibbonLayoutContentProps> = ({ videoList }) =>
{
    const [activeVideoID, setActiveVideoID] = useState<string>("");

    const [videoItemSize, setVideoItemSize] = useState<ElementSize>({ width: 0, height: 0 });

    let activeCard: JSX.Element = <></>;
    const activeCardIdx: number = videoList.findIndex(f => f.id === activeVideoID);
    if( activeCardIdx !== NOT_FOUND_IDX )
    {
        activeCard = <VideoCard style={{ 
            width: videoItemSize.width,
            height: videoItemSize.height 
        }} name={videoList[activeCardIdx].name} />
    }
    else if(videoList.length)
    {
        activeCard = <VideoCard style={{ 
            width: videoItemSize.width,
            height: videoItemSize.height 
        }} name={videoList[ZERO_IDX].name} />
    }

    const createRibbonCard = (video: Video): JSX.Element =>
    {
        const handleClick: MouseEventHandler = () =>
        {
            setActiveVideoID(video.id);
        }
        return (
            <VideoCard className="video-ribbon-card" onClick={handleClick} name={video.name}/>
        );
    }

    const {
        width: layoutWidth,
        height: layoutHeight,
        ref: layoutRef
    } = useResizeDetector<HTMLDivElement>({
        onResize: () =>
        {
            //console.debug("[VideoLayout] video-layout size: ", layoutWidth, layoutHeight);
            recalculateVideoItemSize();
        }
    });

    // Ссылка на список неактивных видео
    const videoCardsRef = useRef<HTMLDivElement>(null);

    // Обработчик для диагонального скролла карточек
    const handleVideoCardsWheel: React.WheelEventHandler<HTMLDivElement> = (ev) =>
    {
        if (ev.shiftKey || !videoCardsRef.current)
        {
            return;
        }
        console.log("dsadsa");
        const SCROLL_OFFSET = 100;
        const ZERO_SCROLL_OFFSET = 0;
        videoCardsRef.current.scrollBy({ left: ev.deltaY > ZERO_SCROLL_OFFSET ? SCROLL_OFFSET : -SCROLL_OFFSET });
    };
    
    const recalculateVideoItemSize = useCallback(() =>
    {
        if ((layoutWidth != null) && (layoutHeight != null))
        {
            const newSize = calculateVideoCardSize(DIMENSIONS_COUNT, DIMENSIONS_COUNT, layoutWidth, layoutHeight);

            if (newSize.width !== videoItemSize.width || newSize.height !== videoItemSize.height)
            {
                setVideoItemSize(newSize);
            }
        }
    }, [layoutWidth, layoutHeight, videoItemSize.height, videoItemSize.width]);

    return (
        <div className="video-ribbon-area">
            <div className="video-ribbon" ref={videoCardsRef} onWheel={window.innerHeight > window.innerWidth? handleVideoCardsWheel : undefined}>
                {videoList.map(createRibbonCard)}
            </div>
            <div className="video-ribbon-active-card" ref={layoutRef}>{activeCard}</div>
        </div>
    );
}

export const MemoizedVideoRibbonLayoutContent = memo(VideoRibbonLayoutContent);
