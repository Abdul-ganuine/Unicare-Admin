import "./Chat.css";
import Details from "./Details";
import profileImage from "../assets/user.svg";
import emoji from "../assets/emoji.png";
import mic from "../assets/mic.png";
import img from "../assets/img.png";
import camera from "../assets/camera.png";
import messageImg from "../assets/prof6.jpeg";
import "./MessageRoom.css";
import EmojiPicker from "emoji-picker-react";
import person from "../assets/prof6.jpeg";
import person2 from "../assets/prof7.jpeg";
import { AiOutlineArrowLeft } from "react-icons/ai";
import "./ChatSidebar.css";
import "./Chatlist.css";
import io from "socket.io-client";
import axios from "axios";

const ENDPOINT = "http://localhost:3000";
let socket, compareChat;

// Debounce function definition
const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../Context/ContextApi";
function Chat() {
  const [showEmojis, setShowEmojis] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInitiated, setChatInitiated] = useState(false);

  const {
    currentUser,
    chat,
    setChat,
    participantDetails,
    setParticipantDetails,

    displayUserInfo,
  } = useContext(GlobalContext);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  function handleEmojiClick(e) {
    setMessage((prev) => prev + e.emoji);
  }
  function handleUserClicked() {
    setChatVisible(true);
    setChatInitiated(true);
  }

  const Id = localStorage.getItem("userId");

  // setting up the socket.io for the real-time communication
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", Id);
    socket.on("connection");
  }, []);

  // send message after typing
  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }

    const url = "http://localhost:3000/knust.students/wellnesshub/chats/send";

    try {
      const result = await axios.post(
        url,
        { message, chatId: chat._id },
        {
          withCredentials: true,
        }
      );
      setChat(result.data);
      localStorage.setItem("selectedChat", JSON.stringify(result.data));
      socket.emit("new message", { data: result.data, chat_id: chat._id });
    } catch (error) {
      console.log(error);
    }

    setMessage("");
  };

  // perform a search query
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to fetch users with debounce
  const fetchUsers = useCallback(
    debounce(async (query) => {
      try {
        const result = await axios.get(
          `http://localhost:3000/knust.students/wellnesshub/tasks/getusers?search=${query}`,
          { withCredentials: true }
        );
        setUsers(result.data);
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    }, 300),
    [] // Will be created only once
  );

  useEffect(() => {
    fetchUsers(searchQuery);
    console.log(users);
  }, [searchQuery, fetchUsers]);

  // clicking and selecting a user to chat with on the left side bar
  const handleChatSelect = async (id) => {
    const url = "http://localhost:3000/knust.students/wellnesshub/chats";
    try {
      const result = await axios.post(
        url,
        { userId: id },
        {
          withCredentials: true,
        }
      );

      // Update selected chat and participant details
      setChat(result.data.chat);
      setParticipantDetails(result.data.details);

      // Store in local storage
      localStorage.setItem("selectedChat", JSON.stringify(result.data.chat));
      localStorage.setItem(
        "selectedChatDetails",
        JSON.stringify(result.data.details)
      );

      setChatVisible(true);
      setChatInitiated(true);

      compareChat = result.data.chat;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const savedChat = localStorage.getItem("selectedChat");
    const savedDetails = localStorage.getItem("selectedChatDetails");
    if (savedChat) {
      setChat(JSON.parse(savedChat));
      setParticipantDetails(JSON.parse(savedDetails));
    }

    console.log(chat);
  }, [setChat]);

  useEffect(() => {
    if (chat && chat._id) {
      socket.emit("join chat", chat._id);
    }
  }, [chat]);

  useEffect(() => {
    socket.on("message received", (newMsRecieved) => {
      // if (!compareChat || compareChat !== newMsRecieved.chat_id) {
      //   // notification here
      // } else {
      //   console.log(newMsRecieved.data);

      // }

      setChat(newMsRecieved.data);
      localStorage.setItem("selectedChat", JSON.stringify(newMsRecieved.data));
    });
  }, [socket]);

  const chatMessage = chat?.messages || [];

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const messageDate = new Date(message.timestamp).toLocaleDateString();

      if (!acc[messageDate]) {
        acc[messageDate] = [];
      }

      acc[messageDate].push(message);
      return acc;
    }, {});
  };

  // Format dates
  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday =
      messageDate.toDateString() ===
      new Date(today.setDate(today.getDate() - 1)).toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return messageDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupedMessages = groupMessagesByDate(chatMessage);

  return (
    <div className="chat">
      {/* Chat sidebar code */}
      <div
        className={`chat-sidebar ${chatVisible ? "chatsidebar-hidden" : null}`}
      >
        <div className="chatlist">
          <div className="chatlist-search-bar">
            <input
              type="search"
              className="chatlist-search"
              placeholder="Search🔍"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>

          {users?.map(({ username, img, time, message, _id }, index) => (
            <div
              className="userItem"
              onClick={() => handleChatSelect(_id)}
              key={index}
            >
              <img
                src={
                  img ? `http://localhost:3000/profImages/${img}` : profileImage
                }
                alt=""
              />
              <div className="userText">
                <span>{username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Room code */}
      {chatInitiated ? (
        <>
          <div
            className={`message-room ${
              chatVisible ? "" : "message-room-hidden"
            }`}
          >
            <div className="message-room-top">
              <div className="userDetails">
                <img src={profileImage} alt="" />
                <div className="userDetailsText">
                  <span>King James</span>
                  <p>This is king James</p>
                </div>
              </div>
              <div
                className="back sendBtn"
                onClick={() => setChatVisible(false)}
              >
                <AiOutlineArrowLeft />
              </div>
            </div>
            <div className="message-room-center">
              {Object.keys(groupedMessages).map((date, index) => (
                <div key={index}>
                  <div className="date-header">{formatDate(date)}</div>
                  {groupedMessages[date].map(
                    ({ text, date, sender }, index) => (
                      <div
                        className={`message ${sender._id === Id ? "own" : ""}`}
                        key={index}
                      >
                        <div className="messageText">
                          <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>
                          <span>{date}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}

              {/* <div className='message'>
                <div className='messageText'>
                  <p>Hello Sir</p>
                  <span>6:32</span>
                </div>
              </div>
              <div className='message own'>
                <div className='messageText'>
                  <p>Hello. How are you?</p>
                  <span>6:32</span>
                </div>
              </div>
              <div className='message'>
                <div className='messageText'>
                  <p>I'm good sir.</p>
                  <span>6:32</span>
                </div>
              </div>
              <div className='message own'>
                <img src={messageImg} alt='' />
                <div className='messageText'>
                  <p>Hello. How are you?</p>
                  <span>6:32</span>
                </div>
              </div>
              <div className='message'>
                <div className='messageText'>
                  <p>I'm good sir.</p>
                  <span>6:32</span>
                </div>
              </div> */}
              <div ref={endRef}></div>
            </div>
            <div className="message-room-bottom">
              <div className="icons">
                <img src={img} alt="" />
                <img src={camera} alt="" />
                <img src={mic} alt="" />
              </div>
              <textarea
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="emoji">
                <img
                  src={emoji}
                  alt=""
                  onClick={() => setShowEmojis((prev) => !prev)}
                />
                <div className="emoji-picker">
                  <EmojiPicker
                    open={showEmojis}
                    onEmojiClick={handleEmojiClick}
                  />
                </div>
              </div>
              <button className="sendBtn" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div
          className={`message-room chat-welcome ${
            chatVisible ? "" : "message-room-hidden"
          }`}
        >
          Welcome👋Start a chat.
        </div>
      )}

      {chatInitiated && <Details />}
    </div>
  );
}

export default Chat;
