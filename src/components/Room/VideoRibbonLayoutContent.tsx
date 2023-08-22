import { FC, MouseEventHandler, memo, useCallback, useRef, useState } from "react";
import { ElementSize, Video, VideoCard, VideoList, calculateVideoCardSize } from "./VideoCard";
import "./VideoRibbonLayoutContent.css";
import { IDX_STEP, NOT_FOUND_IDX, ZERO_IDX } from "../../Utils";
import { useResizeDetector } from "react-resize-detector";
import { MdNavigateNext } from "react-icons/md";
import { Button } from "@mui/material";

interface VideoRibbonLayoutContentProps
{
    videoList: VideoList;
}

const MIN_CARD_CNT = 1;
const MAX_CARD_CNT = 6;
const CARD_HEIGHT = 90;
const CARD_WIDTH = 155;
const NAV_BUTTONS_HEIGHT = 130;
const NAV_BUTTONS_WIDTH = 160;
const START_RIBBON_PAGE = 0;

const DIMENSIONS_COUNT = 1;

const NEXT_PAGE_DISPLACEMENT = 2;

const calculateCardCount = (containerHeight : number, containerWidth : number) : number =>
{
    return Math.min(
        Math.max(
            Math.floor(
                window.innerHeight >= window.innerWidth ? (containerWidth - NAV_BUTTONS_WIDTH) / CARD_WIDTH : (containerHeight - NAV_BUTTONS_HEIGHT) / CARD_HEIGHT
            ),
            MIN_CARD_CNT
        ),
        MAX_CARD_CNT
    );
}

const VideoRibbonLayoutContent: FC<VideoRibbonLayoutContentProps> = ({ videoList }) =>
{
    const [activeVideoID, setActiveVideoID] = useState<string>("");
    const [videoItemSize, setVideoItemSize] = useState<ElementSize>({ width: 0, height: 0 });
    const [ribbonPage, setRibbonPage] = useState<number>(START_RIBBON_PAGE);
    const [videoCardCnt, setVideoCardCnt] = useState<number>(MIN_CARD_CNT);

    const {
        width: layoutWidth,
        height: layoutHeight,
        ref: layoutRef
    } = useResizeDetector<HTMLDivElement>({
        onResize: () =>
        {
            recalculateVideoCardsSize();
        }
    });

    const recalculateVideoCardsSize = useCallback(() =>
    {
        if ((layoutWidth != null) && (layoutHeight != null))
        {
            const cardCnt = calculateCardCount(layoutHeight, layoutWidth);
            setVideoCardCnt(cardCnt);
            
            const maxPageCnt = Math.ceil(videoList.length / videoCardCnt);
            if (ribbonPage >= maxPageCnt)
            {
                setRibbonPage(Math.max(maxPageCnt - IDX_STEP, ZERO_IDX));
            }

            const activeVideoSize = calculateVideoCardSize(DIMENSIONS_COUNT, DIMENSIONS_COUNT, layoutWidth, layoutHeight);
            if (activeVideoSize.width !== videoItemSize.width || activeVideoSize.height !== videoItemSize.height)
            {
                setVideoItemSize(activeVideoSize);
            }
        }
    }, [layoutWidth, layoutHeight, videoList, videoCardCnt, ribbonPage, videoItemSize.width, videoItemSize.height]);


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
            <VideoCard key={video.id} className="video-ribbon-card" onClick={handleClick} name={video.name}/>
        );
    }

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

    const pagesCnt = Math.ceil(videoList.length / videoCardCnt);
    
    const handlePrevPageClick : MouseEventHandler = () =>
    {
        if (ribbonPage > ZERO_IDX)
        {
            setRibbonPage(ribbonPage - IDX_STEP);
        }
    }

    const handleNextPageClick : MouseEventHandler = () =>
    {
        if (ribbonPage + IDX_STEP < pagesCnt)
        {
            setRibbonPage(ribbonPage + IDX_STEP);
        }
    }

    const pageStartIdx = ribbonPage * videoCardCnt;

    return (
        <div className="video-ribbon-layout">
            <div className="video-ribbon" ref={videoCardsRef} onWheel={window.innerHeight > window.innerWidth? handleVideoCardsWheel : undefined}>
                <div className="video-ribbon-button-container">
                    {
                        ribbonPage > ZERO_IDX ?
                            <>
                                <Button className="video-ribbon-button" onClick={handlePrevPageClick}>
                                    <MdNavigateNext className="video-ribbon-prev-page-icon" />
                                </Button>
                                <div className="video-ribbon-button-label video-ribbon-prev-button-label">{ribbonPage} / {pagesCnt}</div>
                            </>
                        :
                            <></>
                    }
                </div>
                {videoList.slice(pageStartIdx, pageStartIdx + videoCardCnt).map(createRibbonCard)}
                <div className="video-ribbon-button-container">
                    {
                        ribbonPage + IDX_STEP < pagesCnt ?
                            <>
                                <div className="video-ribbon-button-label video-ribbon-next-button-label">{ribbonPage + NEXT_PAGE_DISPLACEMENT} / {pagesCnt}</div>
                                <Button className="video-ribbon-button" onClick={handleNextPageClick}>
                                    <MdNavigateNext className="video-ribbon-next-page-icon" />
                                </Button>
                            </>
                        :
                            <></>
                    }
                </div>
            </div>
            <div className="video-ribbon-active-card" ref={layoutRef}>{activeCard}</div>
        </div>
    );
}

export const MemoizedVideoRibbonLayoutContent = memo(VideoRibbonLayoutContent);
