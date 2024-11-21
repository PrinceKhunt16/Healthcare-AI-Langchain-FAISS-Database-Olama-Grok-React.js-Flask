import React, { useState } from 'react'
import "./index.css"
import { BsFillArrowDownCircleFill } from "react-icons/bs";

const ResourceFinder = () => {
  const [content, setContent] = useState([]);
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      fetchRecommendations();
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setContent(data.recommendations || []);
      setInput("")
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="p-6 bg-gradient-to-br from-blue-100/50 to-blue-200 min-h-screen text-black text-lg font-normal flex flex-col justify-between">
        <div>
          <div className="w-full flex justify-center">
            <div className="flex items-center w-full max-w-xl relative">
              <input
                type="text"
                placeholder="What do you wanna find?"
                className="flex-grow pr-12 p-3 border-none rounded-full bg-slate-300 focus:outline-none placeholder-slate-500 text-lg shadow-xl"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyDown={handleKeyDown}
              />
              <button onClick={() => fetchRecommendations()} className="absolute right-2 bg-none text-white shadow-2xl font-normal text-base cursor-pointer">
                <BsFillArrowDownCircleFill fontSize={34} color='#1f2937' />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pb-[60px]">
            {content.map((video, index) => (
              <div key={index} className={`card ${index % 2 === 0 ? 'even-card' : 'odd-card'}`}>
                <div className="iframe-container cursor-pointer">
                  <iframe
                    src={video.url}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                </div>
                <h2 className="text-lg font-normal m-2">{video.title.slice(0, 65)}{video.title.length > 60 ? "..." : ""}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceFinder