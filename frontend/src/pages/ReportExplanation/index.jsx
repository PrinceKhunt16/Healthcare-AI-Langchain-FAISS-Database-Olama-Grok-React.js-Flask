import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { MdOutlineSimCardDownload } from "react-icons/md";
import { BsFillArrowUpCircleFill } from "react-icons/bs";

const ReportExplanation = () => {
  const initialChats = [
    { sender: 'bot', message: 'Welcome to Healthcare AI Chatbot. How can I assist you today?' },
  ];  
  const [chats, setChats] = useState(initialChats);
  const [inputMessage, setInputMessage] = useState('');
  const [summary, setSummary] = useState("");
  const [show, setShow] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSendMessage();
    }
  };

  const handleFileUpload = async (event) => {
    if (!event.target.files[0]) {
      alert("Please upload a file before submitting.");
      return;
    }

    const uploadedFile = event.target.files[0];
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/report-summary", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setShow(true);
        setSummary(data.summary || "Summary not available.");
      } else {
        setShow(false);
        alert(data.message || "An error occurred while fetching the summary.");
      }
    } catch (error) {
      console.error("Error submitting the file:", error);
      alert("An error occurred.");
    }
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
        // const response = await fetch('http://127.0.0.1:5000/chatbot', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ prompt: inputMessage }),
        // });

        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }

        // const data = await response.json();

        // const botResponse = {
        //   sender: 'bot',
        //   message: data.output || 'I’m here to help!',
        //   timestamp: new Date().toLocaleTimeString(),
        // };

        // setChats((prevChats) => [...prevChats, botResponse]);
        // simulation(data.output)
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

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100/50 to-blue-200 min-h-screen text-black text-lg font-normal flex flex-col">
      <div className='flex justify-between'>
        <h1 className="text-4xl font-medium mb-8">Upload and Get Report Summary</h1>
        <label>
          <div className='bg-slate-300 cursor-pointer hover:bg-slate-300 w-[40px] h-[40px] flex justify-center items-center rounded-full'>
            <MdOutlineSimCardDownload size={24} />
          </div>
          <input
            type="file"
            className="hidden"
            accept="application/pdf, application/txt"
            onChange={(e) => handleFileUpload(e)}
          />
        </label>
      </div>
      {show && (
        <>
          <div className="bg-slate-300/70 p-4 rounded-xl shadow-sm border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">Report Summary:</h2>
            <div className="prose max-w-full font-medium">
              <ReactMarkdown remarkPlugins={[gfm]}>{summary}</ReactMarkdown>
            </div>
          </div>
          <div className={`flex justify-center mt-4 transition-all duration-300`}>
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
        </>
      )}
    </div>
  );
}

export default ReportExplanation;