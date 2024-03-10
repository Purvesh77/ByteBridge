import React, { useState, useEffect } from "react";
import ChatName from "./Name/ChatName";
import { ChatState } from "../../context/ChatProvider";
// import { ChatState } from "../../context/ChatProvider";
import "./Chat.css";
import AccessChat from "./AccessChat/AccessChat";
import MessageBox from "./MessageBox/MessageBox";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";

const ENDPOINT = "https://codenova-api.onrender.com/";
var socket, selectedChatCompare;
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    isUserLoggedIn,
  } = ChatState();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isUserLoggedIn.current) {
      navigate("/login");
    }
    socket = io(ENDPOINT);
    console.log(socket);
    // console.log(JSON.parse(localStorage.getItem("userInfo")).data.user);
    socket.emit(
      "setup",
      JSON.parse(localStorage.getItem("userInfo"))
        ? JSON.parse(localStorage.getItem("userInfo")).data.user
        : ""
    );
    socket.on("connected", () => setSocketConnected(true));
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const handleclick = async () => {
    // console.log(selectedChat);

    try {
      if (newMessage) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "https://codenova-api.onrender.com/api/v1/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   socket.on("message recieved", (newMessageReceived) => {
  //     // console.log("oooooooooooooooooooooooooooooooooooooooooooooooo");
  //     if (
  //       !selectedChatCompare ||
  //       selectedChatCompare._id !== newMessageReceived.chat._id
  //     ) {
  //       //notification
  //     } else {
  //       console.log("=-----------new------------=");
  //       console.log(newMessageReceived);
  //       setMessages([...messages, newMessageReceived]);
  //     }
  //   });
  // });
  return (
    <div className="chat-box">
      <div className="chatName">
        <ChatName />
      </div>
      <div className="chats">
        <div className="showChat">
          <AccessChat
            messages={messages}
            setMessages={setMessages}
            socket={socket}
            selectedChatCompare={selectedChatCompare}
          />
        </div>
        <input
          className="messageBox"
          type="text"
          value={newMessage}
          style={{
            color: "black",
          }}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        {/* <TextField
          id="filled-basic"
          label=""
          variant="outlined"
          className="messageBox"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
        /> */}
        <button
          className="btn"
          style={{
            cursor: "pointer",
          }}
          onClick={handleclick}
        >
          Login
        </button>

        {/* </input> */}
      </div>
    </div>
  );
};

export default Chat;
