import React, { useEffect, useRef, useState } from 'react';
import { ImAttachment } from 'react-icons/im';
import { MdSend } from 'react-icons/md';
import "./Chat.css";
import { Message } from './Message';
import { TooltipTopBottom } from '../../Tooltip';
import { Button } from '@mui/material';
import { ChatFileInfo, FileLoadingCard } from './FileLoadingCard';

/** Информация о сообщении в чате. */
interface ChatMessage
{
    userId: string;
    type: "file" | "text";
    datetime: number;
    content: ChatFileInfo | string;
}
const temp: ChatMessage[] = [];
/* для передачи на сервер */
const formData = new FormData();
let files = [];
export const Chat: React.FC = () =>
{
    /* Хук для перехвата сообщения */
    const [textMsg, setTextMsg] = useState("");
    /* Хук взятия пути для скачивания файла после вставки */
    const [pathFile, setPathFile] = useState("");
    /* Хук для перехвата изменения длины строки ввода (placeholder)*/
    const [isHiddenPH, setStateHiddenPH] = useState(false);
    /* Хук для отображения загружаемых файлов */
    const [isLoadFile, setFlagLF] = useState(false);

    /* Хук-контейнер для тестовых сообщений */
    const [msgs, setMsgs] = useState<ChatMessage[]>([
        {
            userId: "155sadjofdgknsdfk3", type: "text", datetime: (new Date().getTime()) / 2, content: "Hello, colleagues! "
                + "I think that everything will be fine with us, life is getting better, work is in full swing, the kettle is in the kitchen too."
        },
        {
            userId: "12hnjofgl33154", type: "text", datetime: new Date().getTime() - 20000, content: "Hello everyone! Yes! "
                + "Time goes by, nothing stands still. I am very glad that everything around is developing. I hope everything continues at the same pace."
        },
        { userId: "1bvcbjofg23fxcvds", type: "text", datetime: new Date().getTime() - 15000, content: "Do you see this new file uploading panel? Looks cool!" },
        { userId: "12hnjofgl33154", type: "text", datetime: new Date().getTime() - 10000, content: "Check this: https://bugs.documentfoundation.org/4р4рекарекрке456орпороен56оар5646666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666епопропаркепрке54н5445р4р45р5р45р54р4р6керкер " },
        { userId: "155sadjofdgknsdfk3", type: "file", datetime: new Date().getTime() - 5000, content: { fileId: "cxzvzx23", name: "Master_and_Margo.txt", size: 412428 } },
        { userId: "12hnjofgl33154", type: "file", datetime: new Date().getTime(), content: { fileId: "jghjghj2", name: "About_IT.txt", size: 4212428 } }
    ]);
    /* Хук-контейнер для тестовых файлов */
    const [testFiles, setFiles] = useState<ChatFileInfo[]>([
        { fileId: "hfg123", name: "Язык программирования C++", size: 16188070 },
        { fileId: "jhg312", name: "C++ лекции и упражнения", size: 150537513 },
        { fileId: "kjh366", name: "Современные операционные системы", size: 14280633 },
        { fileId: "loi785", name: "Т.1. Искусство программирования", size: 83673366 },
        { fileId: "nbv890", name: "Автоматное программирование", size: 1785979 },
        { fileId: "xcv519", name: "Паттерны проектирования", size: 68368155 },
        { fileId: "hfg123", name: "Некрономикон", size: 9999999999 },
        { fileId: "jhg312", name: "QT 5.10 Профессиональное программирование на C++", size: 103919024 },
        { fileId: "kjh366", name: "Т.2. Искусство программирования", size: 7235716 },
        { fileId: "loi785", name: "Т.3. Искусство программирования", size: 8612462 },
        { fileId: "nbv890", name: "Т.4. Искусство программирования", size: 99124812 }
    ]);

    const fileCardsRef = useRef<HTMLDivElement>(null);

    useEffect(() =>
    {
        // TODO: Добавить вывод смс;
    }, [textMsg]);

    /*const displayChatMessage = (() =>
    {
        const userId : string = "local"; 
        const datetime = new Date().toLocaleString() + "";
        const content = textMsg;

        const messageDiv = document.createElement("div");
        messageDiv.dataset.userId = userId;
        messageDiv.classList.add("message");

        if (userId == "local")
        {
            messageDiv.classList.add("background-lightgreen");
        }
        else
        {
            messageDiv.classList.add("background-white");
        }

        const messageSenderDiv = document.createElement("div");
        messageSenderDiv.classList.add("d-flex");

        const messageSenderName = document.createElement("span");
        messageSenderName.className = "message-sender-name color-dodgerblue bold";
        messageSenderName.innerText = "testname";//this.usernames.get(userId)!;
        messageSenderName.title = "testname";//this.usernames.get(userId)!;
        messageSenderDiv.appendChild(messageSenderName);

        if (userId != "local")
        {
            const messageSenderId = document.createElement("span");
            messageSenderId.className = "message-sender-id";
            messageSenderId.innerText = `#${userId.substring(0, 4)}`;
            messageSenderId.title = `#${userId}`;
            messageSenderDiv.appendChild(messageSenderId);
        }

        const messageTextDiv = document.createElement("div");
        messageTextDiv.classList.add("message-text");
        //messageTextDiv.innerHTML = wrapLinksInText(escapeHtmlTags(textMsg as string));

        const messageDateDiv = document.createElement("div");
        messageDateDiv.classList.add("message-date");
        messageDateDiv.innerText = datetime;//this.getTimestamp(datetime);

        messageDiv.appendChild(messageSenderDiv);
        messageDiv.appendChild(messageTextDiv);
        messageDiv.appendChild(messageDateDiv);

        //this.chat.append(messageDiv);
        //this.chat.scrollTop = this.chat.scrollHeight;
    });*/
    /*const displayChatLink=((message: ChatMessage)=>
    {
        const { userId, datetime } = message;

        const fileInfo = message.content as ChatFileInfo;

        const messageDiv = document.createElement('div');
        messageDiv.dataset.userId = userId;
        messageDiv.classList.add("message");

        if (userId == "local")
        {
            messageDiv.classList.add("background-lightgreen");
        }
        else
        {
            messageDiv.classList.add("background-white");
        }

        const messageSenderDiv = document.createElement("div");
        messageSenderDiv.classList.add("d-flex");

        const messageSenderName = document.createElement("span");
        messageSenderName.className = "message-sender-name color-dodgerblue bold";
        messageSenderName.innerText = this.usernames.get(userId)!;
        messageSenderName.title = this.usernames.get(userId)!;
        messageSenderDiv.appendChild(messageSenderName);

        if (userId != "local")
        {
            const messageSenderId = document.createElement("span");
            messageSenderId.className = "message-sender-id";
            messageSenderId.innerText = `#${userId.substring(0, 4)}`;
            messageSenderId.title = `#${userId}`;
            messageSenderDiv.appendChild(messageSenderId);
        }

        const messageTextDiv = document.createElement('div');
        messageTextDiv.classList.add("message-text");

        const messageFileLabelSpan = document.createElement('span');
        messageFileLabelSpan.classList.add("color-customgray");
        messageFileLabelSpan.innerText = "Файл: ";

        const messageFileNameSpan = document.createElement('span');
        messageFileNameSpan.className = "color-darkviolet bold";
        messageFileNameSpan.innerText = fileInfo.name;

        const messageFileSizeDiv = document.createElement('div');
        messageFileSizeDiv.className = "message-file-size bold";
        messageFileSizeDiv.innerText = `${(fileInfo.size / (1024 * 1024)).toFixed(3)} MB`;

        messageTextDiv.appendChild(messageFileLabelSpan);
        messageTextDiv.appendChild(messageFileNameSpan);
        messageTextDiv.appendChild(messageFileSizeDiv);

        const messageDateDiv = document.createElement('div');
        messageDateDiv.classList.add("message-date");
        messageDateDiv.innerText = this.getTimestamp(datetime);

        const messageLink = document.createElement('a');
        messageLink.classList.add("message-link");
        messageLink.href = `${window.location.origin}/files/${fileInfo.fileId}`;
        messageLink.target = "_blank";

        messageDiv.appendChild(messageSenderDiv);
        messageDiv.appendChild(messageTextDiv);
        messageDiv.appendChild(messageDateDiv);
        messageDiv.appendChild(messageLink);

        this.chat.append(messageDiv);
        this.chat.scrollTop = this.chat.scrollHeight;
    });*/
    /* Хук для отображения загружаемых файлов при сворачивании */
    /*const [isCollapseCards, setStateCC] = useState(false);
    const componentSize = useRef<HTMLDivElement>(null);
    useEffect(() => {
        console.log("Start");
        const observer = new ResizeObserver(e => {console.log("Middle");
            if (componentSize && componentSize.current && componentSize.current.clientHeight < 260){
                setStateCC(true);
                console.log("IF");
            }else if(componentSize && componentSize.current){
                setStateCC(false);
                console.log("Else");
            }
        });
        if (componentSize && componentSize.current)
            observer.observe(componentSize.current);
    }, [])*/
    const chatElement = useRef<HTMLDivElement>(null);
    const sendMsgOnClick = (() =>
    {
        chatElement.current!.scrollTop = chatElement.current!.scrollHeight;
        temp.push({ userId: "1bvcbjofg23fxcvds", type: "text", datetime: new Date().getTime(), content: textMsg.trim() });
        setMsgs(temp);
        setFlagLF(false);
    });

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
            setData(data + 100000);
        }, 1000);
    }, [data]);

    const loadFileOnClick = (e: React.FormEvent<HTMLInputElement>) =>
    {
        e.preventDefault();
        setFlagLF(true);
        const filesToUpload = fileComponent.current!.files;
        console.log(filesToUpload);
        const formSent = new FormData();
        if (filesToUpload!.length > 0)
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
        return false;
    };
    const removeCard = (fileId: string) =>
    {
        testFiles.map(f =>
        {
            if (f.fileId == fileId)
            {
                testFiles.splice(testFiles.findIndex(t => t.fileId == fileId), 1);
            }
        });
        if (!testFiles.length)
            setFlagLF(false);
    };
    const InputHandler = (e: React.KeyboardEvent<HTMLDivElement>) =>
    {
        if (!e.shiftKey && e.code == 'Enter')
        {
            e.preventDefault();
            sendMsgOnClick();
        }
    };
    // проверка на выставление placeholder-а для поля ввода
    // Ссылка на компонент ввода сообщения (чтобы избежать выставления <br> для PH)
    const text_area = useRef<HTMLDivElement>(null);
    const checkPlaceholder = (text: string) =>
    {
        if(text_area.current!.innerHTML != "<br>"){
            if (!text.length)
                setStateHiddenPH(false);
            else
                setStateHiddenPH(true);
        }else{
            setStateHiddenPH(false);
        }
    };
    // Вставка файла через ctrl+v
    const pasteFile = (e: React.ClipboardEvent<HTMLDivElement>) =>
    {
        setFlagLF(true);
        setPathFile(e.clipboardData.getData("text"));
        files = [e.clipboardData.items];
        formData.append('file', e.clipboardData.items[1].getAsFile()!);
        console.log("size: " + (e.clipboardData.items[0].getAsFile()!.size / 1000).toString() + "KB");
        console.log("name: " + e.clipboardData.items[1].getAsFile()!.name);
        console.log("type: " + e.clipboardData.items[1].getAsFile()!.type);
        e.preventDefault();
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

    return (
        <>  <div id="chat" ref={chatElement} aria-readonly>
            {msgs.map(m =>
            {
                return <Message key={m.userId + m.datetime.toString()} message={m} />;
            })
            }
        </div>
            {isLoadFile && testFiles.length ?
                <div className='view-file-cards-area' ref={fileCardsRef} onWheel={fileCardsWheelHandler}>
                    {testFiles.map(f =>
                    {
                        return <FileLoadingCard file={f} onRemove={() => {removeCard(f.fileId)}} progress={data > f.size ? f.size : data /* TODO: Убрать эту проверку после реализации нормальной очереди */} />;
                    })}
                </div>
                : <></>
            }
            <div className='msg-input-area'>
                {loadFileBtn}
                <div id="message-textarea-wrapper">
                    <div id="message-textarea"
                        role="textbox"
                        ref={text_area}
                        onKeyDown={e => { InputHandler(e); }}
                        aria-multiline="true"
                        contentEditable="true"
                        title='Поле ввода сообщения'
                        onPaste={e => {pasteFile(e)}}
                        onInput={e =>
                        {
                            const tmp: HTMLDivElement = e.currentTarget;
                            const text: string = tmp.innerText;
                            setTextMsg(text);
                            checkPlaceholder(text);
                        }}>
                    </div>
                    {!isHiddenPH? 
                        <div id="message-textarea-placeholder" 
                            onClick={e=>{text_area.current!.focus()}}
                        >Напишите сообщение...</div> 
                    : <></>}
                </div>
                {sendMsgBtn}
            </div>
        </>
    );
};