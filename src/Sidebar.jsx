import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, historyClose, setHistoryClose} = useContext(MyContext);

    const apiUrl = import.meta.env.VITE_API_CHAT_URL;

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${apiUrl}/thread`);
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${apiUrl}/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${apiUrl}/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    const handleHistory = ()=>{
        setHistoryClose(!historyClose);
    }
    return (
        <section className={historyClose ? "sidebar" : "sidebarHide"}>
            <button style={{border: "none"}}>
                <img src="https://res.cloudinary.com/dxiwfkziw/image/upload/v1753254594/Logo/blacklogo_x7dmun.png" alt="gpt logo" className="logo"></img>
                <span className="close" onClick={handleHistory}><i class="fa-solid fa-xmark"></i></span>
            </button>
            <button onClick={createNewChat}>
                <span style={{fontSize:"0.8rem"}}><i className="fa-solid fa-pen-to-square"></i> New Chat</span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
                <p>By Ganesh Sargar &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;