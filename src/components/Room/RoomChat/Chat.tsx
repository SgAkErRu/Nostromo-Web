import React, { useEffect, useRef, useState } from 'react';
import { ImAttachment } from 'react-icons/im';
import { MdSend } from 'react-icons/md';
import "./Chat.css";
import { Message } from './Message';
import { TooltipTopBottom } from '../../Tooltip';
import { Button } from '@mui/material';
import { ChatFileInfo, FileLoadingCard, LoadFileInfo } from './FileLoadingCard';
import { isEmptyString } from "../../../Utils";

/** Информация о сообщении в чате. */
interface ChatMessage
{
    userId: string;
    type: "file" | "text";
    datetime: number;
    content: ChatFileInfo | string;
}

/* для передачи на сервер */
const formData = new FormData();
let files = [];
export const Chat: React.FC = () =>
{
    /* Хук взятия пути для скачивания файла после вставки */
    const [pathFile, setPathFile] = useState("");
    /* Показывать ли placeholder в поле для ввода. */
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    /* Хук для отображения загружаемых файлов */
    const [showFileCards, setShowFileCards] = useState(false);

    /* Хук-контейнер для тестовых сообщений */
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            userId: "155sadjofdgknsdfk3", type: "text", datetime: (new Date().getTime()) / 2, content: "Приветствую, коллеги! "
                + "Сегодня **прекрасный** день чтобы опробовать пару `новых` возможностей чата. Теперь можно выделять **важные моменты** парой звёздочек!"
        },
        {
            userId: "12hnjofgl33154", type: "text", datetime: new Date().getTime() - 20000, content: "Всем привет! А ещё теперь можно **обмениваться `кодом` прямо в сообщениях:**\n"
                + "\n```HAI 1.0\n\tI HAS A NAME\n\tVISIBLE \"Wat is yo name7\"\n\tGIMMEH NAME\n\tVISIBLE \"Hai \" NAME \"!!1\"\nKTHXBYE```"
        },
        { userId: "1bvcbjofg23fxcvds", type: "text", datetime: new Date().getTime() - 15000, content: "Do you see this new file uploading panel? Looks cool!" },
        { userId: "12hnjofgl33154", type: "text", datetime: new Date().getTime() - 10000, content: "Работа идёт полным ходом: https://gitlab.com/nostromo-rtc/nostromo-web/-/issues/13\nУже почти закончили чат"
                + "\nИз свежих изменений: https://gitlab.com/nostromo-rtc/nostromo-web/-/commit/49167e06573bb13ef9c5ba95261cfb00100e8662, https://gitlab.com/nostromo-rtc/nostromo-web/-/commit/934d5d7f00af08dd724eae7efee44d0f31ab6b9e и https://gitlab.com/nostromo-rtc/nostromo-web/-/commit/31818b68f40dd739ff257da0f585d1092319f773" },
        { userId: "155sadjofdgknsdfk3", type: "file", datetime: new Date().getTime() - 5000, content: { fileId: "cxzvzx23", name: "Master_and_Margo.txt", size: 412428 } },
        { userId: "12hnjofgl33154", type: "file", datetime: new Date().getTime(), content: { fileId: "jghjghj2", name: "About_IT.txt", size: 4212428 } }
    ]);
    /* Хук-контейнер для тестовых файлов */
    const [testFiles, setFiles] = useState<LoadFileInfo[]>([
        { file: {fileId: "hfg123", name: "Язык программирования C++", size: 16188070}, progress: 0},
        { file: {fileId: "jhg812", name: "C++ лекции и упражнения", size: 150537513}, progress: 0},
        { file: {fileId: "kjh306", name: "Современные операционные системы", size: 14280633}, progress: 0},
        { file: {fileId: "lou785", name: "Т.1. Искусство программирования", size: 83673366}, progress: 0},
        { file: {fileId: "nbo890", name: "Автоматное программирование", size: 1785979}, progress: 0},
        { file: {fileId: "xcv519", name: "Паттерны проектирования", size: 68368155}, progress: 0},
        { file: {fileId: "hfg623", name: "Некрономикон", size: 9999999999}, progress: 0},
        { file: {fileId: "jhg312", name: "QT 5.10 Профессиональное программирование на C++", size: 103919024}, progress: 0},
        { file: {fileId: "kjh366", name: "Т.2. Искусство программирования", size: 7235716}, progress: 0},
        { file: {fileId: "loi785", name: "Т.3. Искусство программирования", size: 8612462}, progress: 0},
        { file: {fileId: "nbv890", name: "Т.4. Искусство программирования", size: 99124812}, progress: 0}
    ]);

    const fileCardsRef = useRef<HTMLDivElement>(null);

    // Ссылка на компонент с полем для ввода сообщения.
    const textAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() =>
    {
        // TODO: Добавить вывод смс;
    }, []);

    useEffect(() =>
    {
        if (chatElement.current)
        {
            chatElement.current.scrollTop = chatElement.current.scrollHeight;
        }
    }, [messages]);

    const chatElement = useRef<HTMLDivElement>(null);
    const sendMsgOnClick = (): void =>
    {
        if (!chatElement.current || !textAreaRef.current)
        {
            return;
        }

        const newMessage = textAreaRef.current.innerText.trim();

        if (isEmptyString(newMessage))
        {
            return;
        }

        const message: ChatMessage =
        {
            userId: "1bvcbjofg23fxcvds",
            type: "text",
            datetime: new Date().getTime(),
            content: newMessage
        };

        // FIXME: возможно concat не самый лучший способ в React так объединять старое и новое состояние.
        // Это просто пока заглушка, но когда будет настоящий код, 
        // следует подобрать наилучший метод для этого действия.
        setMessages((prev) => prev.concat(message));

        // Очищаем поле для ввода после отправки сообщения.
        textAreaRef.current.innerText = "";
        // Очистка выше не вызывает событий "input" или "event" для textArea.
        // Поэтому включаем placeholder вручную.
        setShowPlaceholder(true);

        setShowFileCards(false);
    };

    const sendMsgBtn = (
        <TooltipTopBottom title="Отправить">
            <div className="chat-btn-box">
                <Button aria-label='Отправить'
                    onClick={sendMsgOnClick}
                >
                    <MdSend className='btn-icon' />
                </Button>
                <div className="chat-btn-clickable-area non-selectable" onClick={sendMsgOnClick}></div>
            </div>
        </TooltipTopBottom>
    );
    /*** Кнопка отправки файлов ***/
    const fileComponent = useRef<HTMLInputElement>(null);
    // Тестовый прогресс бар
    const [data, setData] = useState(0);
    useEffect(() =>
    {
        setTimeout(function ()
        {
            const idx = testFiles.findIndex(f=>f.progress < f.file.size);
            if(idx !== -1){
                testFiles[idx].progress += 1000000;
                if(testFiles[idx].progress >= testFiles[idx].file.size){
                    testFiles[idx].progress = testFiles[idx].file.size;
                }
            }
            setData(data + 100000);
        }, 1000);
    }, [data]);

    const loadFileOnClick = (e: React.FormEvent<HTMLInputElement>): boolean =>
    {
        e.preventDefault();
        setShowFileCards(true);
        if (fileComponent.current)
        {
            const filesToUpload = fileComponent.current.files;
            console.log(filesToUpload);
            const formSent = new FormData();
            if (filesToUpload && filesToUpload.length > 0)
            {
                for (const item in filesToUpload)
                {
                    formSent.append('file-input-btn', item);
                    console.log(item);
                }
            } else
            {
                alert('Сначала выберите файл');
            }
        }
        return false;
    };
    const removeCard = (fileId: string): void =>
    {
        const fileIdx = testFiles.findIndex(t => t.file.fileId === fileId);
        if (fileIdx !== -1)
        {
            testFiles.splice(fileIdx, 1);
        }
        if (!testFiles.length)
        {
            setShowFileCards(false);
        }
    };
    const moveLeft = (fileId: string): void =>
    {
        const fileIdx = testFiles.findIndex(t => t.file.fileId === fileId);
        if (fileIdx !== -1 && fileIdx !== 0)
        {
            const tmp: LoadFileInfo = testFiles[fileIdx];
            testFiles[fileIdx] = testFiles[fileIdx - 1];
            testFiles[fileIdx - 1] = tmp;
        }
    };
    const moveRight = (fileId: string): void =>
    {
        const fileIdx = testFiles.findIndex(t => t.file.fileId === fileId);
        if (fileIdx !== -1 && fileIdx !== (testFiles.length - 1))
        {
            const tmp: LoadFileInfo = testFiles[fileIdx];
            testFiles[fileIdx] = testFiles[fileIdx + 1];
            testFiles[fileIdx + 1] = tmp;
        }
    };

    const handleTextAreaKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (ev) =>
    {
        if (!ev.shiftKey && ev.code === 'Enter')
        {
            ev.preventDefault();
            sendMsgOnClick();
        }
    };

    const handleTextAreaInput: React.FormEventHandler<HTMLDivElement> = (ev) =>
    {
        const str = ev.currentTarget.innerText;
        const emptyOrOnlyNewLine = (isEmptyString(str) || str === "\n");
        setShowPlaceholder(emptyOrOnlyNewLine);
    };

    // Вставка файла через ctrl+v
    const handleClipboardEvent : React.ClipboardEventHandler<HTMLDivElement> = (ev) =>
    {
        setShowFileCards(true);
        setPathFile(ev.clipboardData.getData("text"));
        files = [...ev.clipboardData.items];
        for (const f of files)
        {
            if (f.kind === "file")
            {
                const fileData = f.getAsFile();
                if (fileData)
                {
                    const filesCopy = [...testFiles];
                    filesCopy.push({file: {fileId: new Date().getMilliseconds().toString(), name: fileData.name, size: fileData.size}, progress: 0 });
                    setFiles(filesCopy);

                    formData.append('file', fileData);
                    console.log("size: " + (fileData.size / 1000).toString() + "KB");
                    console.log("name: " + fileData.name);
                    console.log("type: " + fileData.type);
                }
            }
        }
        ev.preventDefault();
    };
    const loadFileBtn = (
        <TooltipTopBottom title="Загрузить">
            <div className="chat-btn-box">
                <Button aria-label='Загрузить'>
                    <ImAttachment className='btn-icon' />
                    <input type="file" id="file-input-btn" ref={fileComponent} onChange={e => loadFileOnClick(e)} name="file" multiple hidden />
                </Button>
                <label className="chat-btn-clickable-area non-selectable" >
                    <input type="file" id="file-input-btn-area" ref={fileComponent} onChange={e => loadFileOnClick(e)} name="file" multiple hidden />
                </label>
            </div>
        </TooltipTopBottom>
    );

    const fileCardsWheelHandler: React.WheelEventHandler<HTMLDivElement> = (ev) =>
    {
        if (ev.shiftKey || !fileCardsRef.current)
        {
            return;
        }

        ev.preventDefault();
        const SCROLL_OFFSET = 100;
        const ZERO_SCROLL_OFFSET = 0;
        fileCardsRef.current.scrollBy({ left: ev.deltaY > ZERO_SCROLL_OFFSET ? SCROLL_OFFSET : -SCROLL_OFFSET });
    };

    const placeholderElem = <div
        id="message-textarea-placeholder"
    >
        Напишите сообщение...
    </div>;

    return (
        <>  <div id="chat" ref={chatElement} aria-readonly>
            {messages.map(m =>
            {
                return <Message key={m.userId + m.datetime.toString()} message={m} />;
            })
            }
        </div>
            {showFileCards && testFiles.length ?
                <div className='view-file-cards-area' ref={fileCardsRef} onWheel={fileCardsWheelHandler}>
                    {testFiles.map(f =>
                    {
                        return <FileLoadingCard loading={f} 
                            onRemove={() => { removeCard(f.file.fileId); }} 
                            onMoveLeft={() => { moveLeft(f.file.fileId); }}
                            onMoveRight={() => { moveRight(f.file.fileId); }}/>;
                    })}
                </div>
                : <></>
            }
            <div className='message-input-area'>
                {loadFileBtn}
                <div id="message-textarea-container">
                    <div id="message-textarea-wrapper">
                        <div id="message-textarea"
                            role="textbox"
                            ref={textAreaRef}
                            onKeyDown={handleTextAreaKeyDown}
                            aria-multiline="true"
                            contentEditable="true"
                            title='Поле ввода сообщения'
                            onPaste={handleClipboardEvent}
                            onInput={handleTextAreaInput}>
                        </div>
                        {showPlaceholder ? placeholderElem : <></>}
                    </div>
                </div>
                {sendMsgBtn}
            </div>
        </>
    );
};