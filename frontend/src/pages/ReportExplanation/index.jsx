import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { MdOutlineSimCardDownload } from "react-icons/md";

const ReportExplanation = () => {
  const [summary, setSummary] = useState("");
  const [show, setShow] = useState(false);

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
        </>
      )}
    </div>
  );
}

export default ReportExplanation;