import { FormEvent, useEffect, useRef, useState } from "react";
import Message from "../Components/Message";
import NavBar from "../Components/NavBar";
import TextBox from "../Components/TextBox";
import { Socket, io } from "socket.io-client";
import useUser from "../CustomHooks/useUser";

function App() {
  const socketRef = useRef<Socket | null>();
  const [messages, setMessages] = useState<
    { message: string; owner: string; creation: string; offset: string }[]
  >([]);
  const { data } = useUser();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const messageBox = document.getElementById("message-box") as HTMLInputElement;

    if (socketRef.current !== null && messageBox && messageBox.value !== "") {
      socketRef.current?.emit("message", messageBox.value);
      messageBox.value = "";
    }
  }

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      auth: {
        severOffset: 0,
        username: data?.username,
      },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connected");
    });

    const chatScroll = document.getElementById("chat-scroll");

    socket.on(
      "message",
      (message: {
        owner: string;
        message: string;
        content: string;
        created_at: string;
        serverOffset: string;
      }) => {
        const { owner, message: content, created_at, serverOffset } = message;
        setMessages((prev) => [
          ...prev,
          { message: content, owner, creation: created_at, offset: serverOffset },
        ]);

        if (chatScroll) {
          chatScroll.scrollTop = chatScroll.scrollHeight;
        }
      }
    );

    return () => {
      console.log("disconnected");
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <NavBar></NavBar>
      <main className="h-screen justify-center content-center">
        <div className="flex flex-col bg-black rounded-2xl h-[75vh]  w-[38vw] mx-auto p-2 relative">
          <section
            id="chat-scroll"
            className="px-12 scroll-smooth rounded-2xl h-[85%] overflow-y-scroll gap-2  mt-12 scroll-deco"
          >
            {messages.map((message) => (
              <Message
                key={message.offset}
                message={message.message}
                from={message.owner === data?.username ? "You" : message.owner}
              ></Message>
            ))}
          </section>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-row justify-center pt-3 absolute bottom-2"
          >
            <TextBox
              placeholder="Message"
              id="message-box"
              className="w-[80%] mx-2  overflow-y-clip "
            ></TextBox>
            <button className="p-1/2 bg-purple-600 rounded-full w-12 h-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#ffffff"
                fill="none"
                className="mx-auto hover:scale-105 active:scale-110 transition-all"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 14l11 -11" />
                <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
              </svg>
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default App;
