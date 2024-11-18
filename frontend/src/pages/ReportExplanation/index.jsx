import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { MdOutlineSimCardDownload } from "react-icons/md";

const ReportExplanation = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose a file");
  const [summary, setSummary] = useState("");

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setFileName(uploadedFile.name);
    setSummary(`
## 1. **Bold & Italics**
This text is **bold** and this text is *italic*. You can even _**combine**_ them for extra emphasis.
## 2. **Lists**
### Ordered List:
1. First item
2. Second item
   - Nested bullet
3. Third item
### Unordered List:
- Bullet point
  - **Bold nested** bullet point
- Another bullet
## 3. **Quotes**
> “The only way to do great work is to love what you do.” – Steve Jobs
      `);
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
            onChange={handleFileUpload}
          />
        </label>
      </div>
      {file && (
        <div className="bg-slate-300/70 p-4 rounded-xl shadow-sm border-slate-200">
          <h2 className="text-2xl font-semibold mb-4">Report Summary:</h2>
          <div className="prose max-w-full font-medium">
            <ReactMarkdown remarkPlugins={[gfm]}>{summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportExplanation;