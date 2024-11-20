import React, { useState, useRef, useEffect } from 'react'
import "./index.css"
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const Chatbot = ({ ml }) => {
  const initialChats = [
    { sender: 'bot', message: 'Welcome to Healthcare AI Chatbot. How can I assist you today?' },
  ];  

  const [chats, setChats] = useState(initialChats);
  const [inputMessage, setInputMessage] = useState('');
  const [typingSpeed] = useState(10);
  const endOfMessagesRef = useRef(null);
  const widthCalc = `calc(100% - ${ml === 14 ? "56px" : "256px"})`;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSendMessage();
    }
  };

  const simulation = (message) => {
    let index = 0;
    let currentMessage = '';
    const typingInterval = setInterval(() => {
      if (index < message.length) {
        currentMessage += message[index];
        index += 1;
        setChats((prevChats) => {
          const updatedChats = [...prevChats];
          const lastBotMessage = updatedChats[updatedChats.length - 1];
          if (lastBotMessage?.sender === 'bot') {
            updatedChats[updatedChats.length - 1].message = currentMessage;
          } else {
            updatedChats.push({ sender: 'bot', message: currentMessage });
          }
          return updatedChats;
        });

        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      const newMessage = {
        sender: 'user',
        message: inputMessage,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChats([...chats, newMessage]);
      setInputMessage('');

      try {
        const response = await fetch('http://127.0.0.1:5000/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: inputMessage }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const botResponse = {
          sender: 'bot',
          message: data.output || 'I’m here to help!',
          timestamp: new Date().toLocaleTimeString(),
        };

        setChats((prevChats) => [...prevChats, botResponse]);
        simulation(data.output)
      } catch (error) {
        console.error('Error:', error);
        const errorResponse = {
          sender: 'bot',
          message: 'Sorry, something went wrong. Please try again later.',
          timestamp: new Date().toLocaleTimeString(),
        };
        setChats((prevChats) => [...prevChats, errorResponse]);
      }
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100/50 to-blue-200 min-h-screen text-black text-lg font-normal">
      <div className='max-w-screen-lg mx-auto'>
        <div className="mb-[80px] overflow-y-auto text-xl">
          {chats.map((chat, index) => (
            <div
              key={index}
              className={`my-4 ${
                chat.sender === 'bot' ? 'left-message' : 'right-message'
              }`}
            >
              <div
                className={`max-w-3xl backdrop-blur-xl p-2 rounded-xl inline-block ${
                  chat.sender === 'bot' ? '' : 'bg-slate-300/90'
                }`}
              >
                <ReactMarkdown remarkPlugins={[gfm]}>{chat.message}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      </div>
      <div className="max-w-xl mx-auto">
        <div className={`fixed-search-bar l-${ml} flex justify-center mt-4 transition-all duration-300`} style={{ width: widthCalc }}>
            <div className="flex items-center w-full max-w-xl relative">
              <input
                type="text"
                placeholder="Message Chatbot"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow pr-12 p-3 border-none rounded-full bg-slate-300 focus:outline-none placeholder-slate-500 text-lg shadow-xl"
              />
              <button
                className="absolute right-2 bg-none text-white shadow-2xl font-normal text-base cursor-pointer"
                onClick={handleSendMessage}
              >
                <BsFillArrowUpCircleFill fontSize={34} color="#1f2937" />
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Chatbot