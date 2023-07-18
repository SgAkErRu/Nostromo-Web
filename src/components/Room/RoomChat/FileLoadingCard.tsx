import { FcFile } from "react-icons/fc"

// TODO: Не забыть убрать отсюда после наладки работы с NS Shared
export interface ChatFileInfo {
    fileId: string;
    name: string;
    size: number;
}

interface fileProps {
    file      : ChatFileInfo;        //!< Данные файла
    progress  : number;              //!< Прогресс загрузки
    onRemove? : (id : string)=>void; //!< Обратный вызов при нажатии на кнопку закрытия
}

export const FileLoadingCard: React.FC<fileProps> = (props) => {
    return <>
        <div className='file-cards'>
            <div className='remove-file-btn'
                onClick={() => {if (props.onRemove) props.onRemove(props.file.fileId)}}>Х</div>
            <div className='file-cards-icon'><FcFile className='file-icon' /></div>
            <div className='file-cards-icon'>{props.file.name.substring(0, 16)}</div>
            <div>
                <progress id="progressBar" value={props.progress} max={55500555}></progress>
                <div className="progress-load">{(props.progress / (1024 * 1024)).toFixed(3)}MB из {(props.file.size / (1024 * 1024)).toFixed(3)}MB</div>
            </div>
        </div>
    </>
}
