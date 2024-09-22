import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./index.css";
import { GoPerson } from "react-icons/go";
import { PiNewspaperClippingLight } from "react-icons/pi";
import { PiAddressBookLight } from "react-icons/pi";
import { CiFileOn } from "react-icons/ci";
import { PiVideoLight } from "react-icons/pi";
import { PiSignOutLight } from "react-icons/pi";
import { MdOutlineSegment } from "react-icons/md";
import { CiChat2 } from "react-icons/ci";

const Sidebar = ({ ml, setMl }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isText, setIsText] = useState(false);
  const isActive = (path) => location.pathname === path ? 'active-link text-black' : '';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    navigate('/auth');
    window.location.reload();
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);

    if (isOpen) {
      setTimeout(() => {
        setIsText(!isText);
      }, 200);
    } else {
      setIsText(!isText);
    }

    setMl(!isOpen ? 14 : 64);
  }

  useEffect(() => {
    setMl(isOpen ? 14 : 64);
  }, [isOpen]);

  return (
    <div className={`min-w-14 h-screen bg-gradient-to-b from-blue-800 to-blue-600/90 text-white fixed top-0 flex flex-col ${isOpen ? 'w-14' : 'w-64'} transition-all duration-300`}>
      <div className="h-[70px] pl-4 pt-2 pr-4 pb-2 text-white flex items-center gap-3 relative">
        <button onClick={toggleMenu} className="text-white">
          <MdOutlineSegment className='w-[22px]' size={22} />
        </button>
        <h1
          className={`text-[33px] transition-all duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-10px]'} ease-in-out`}
          style={{ visibility: !isText ? 'visible' : 'hidden', left: '50px' }} 
        >
          Healthcare AI
        </h1>
      </div>
      <ul className="list-none flex-1">
        <li className={`h-[52px] flex items-center mb-2 px-4 ${isActive('/')}`}>
          <Link
            to="/"
            className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-light relative`}
          >
            <GoPerson size={22} color={`${isActive('/') && "black"}`} />
            <span
              className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
              style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
            >
              You
            </span>
          </Link>
        </li>
        <li className={`h-[52px] flex items-center mb-2 px-4 ${isActive('/resource-finder')}`}>
          <Link
            to="/resource-finder"
            className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-light relative`}
          >
            <PiVideoLight size={22} color={`${isActive('/resource-finder') && "black"}`} />
            <span
              className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
              style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
            >
              Resource Finder
            </span>
          </Link>
        </li>
        <li className={`h-[52px] flex items-center mb-2 px-4 ${isActive('/report-explanation')}`}>
          <Link
            to="/report-explanation"
            className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-light relative`}
          >
            <CiFileOn size={22} color={`${isActive('/report-explanation') && "black"}`} />
            <span
              className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
              style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
            >
              Report Explanation
            </span>
          </Link>
        </li>
        <li className={`h-[52px] flex items-center mb-2 px-4 ${isActive('/chatbot')}`}>
          <Link
            to="/chatbot"
            className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-light relative`}
          >
            <CiChat2 size={22} color={`${isActive('/chatbot') && "black"}`} />
            <span
              className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
              style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
            >
              Chatbot
            </span>
          </Link>
        </li>
        <li className={`h-[52px] flex items-center mb-2 px-4 ${isActive('/global-news')}`}>
          <Link
            to="/global-news"
            className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-light relative`}
          >
            <PiNewspaperClippingLight size={22} color={`${isActive('/global-news') && "black"}`} />
            <span
              className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
              style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
            >
              News
            </span>
          </Link>
        </li>
        <li className={`h-[52px] flex items-center mb-2 px-4 ${isActive('/appointment')}`}>
          <Link
            to="/appointment"
            className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-light relative`}
          >
            <PiAddressBookLight size={22} color={`${isActive('/appointment') && "black"}`} />
            <span
              className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
              style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
            >
              Appointment
            </span>
          </Link>
        </li>
      </ul>
      <div className="mt-auto p-4">
        <Link
          onClick={handleLogout}
          to="/auth"
          className={`flex items-center gap-3 w-full text-lg cursor-pointer py-3 font-light relative`}
        >
          <PiSignOutLight size={22} />
          <span
            className={`transition-text duration-300 transform absolute ${!isText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-5px]'} ease-in-out`}
            style={{ visibility: !isText ? 'visible' : 'hidden', left: '35px' }}
          >
            Log Out
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;

{/* <div className="min-w-64 h-screen bg-blue-700 text-white fixed top-0 flex flex-col">
      <div>
        <ul className="list-none">
          <div className="p-4 bg-blue-700 text-white flex items-center gap-3">
            <h1 className="text-3xl">Healthcare AI</h1>
          </div>
          <li className={`flex items-center gap-3 mb-2 px-4 ${isActive('/')}`}>
            <HiOutlineHome size={24} color={`${isActive('/') && "black"}`} />
            <Link
              to="/"
              className={`w-full text-lg block cursor-pointer py-3 font-light`}
            >
              Home
            </Link>
          </li>
          <li className={`flex items-center gap-3 mb-2 px-4 ${isActive('/you')}`}>
            <GoPerson size={24} color={`${isActive('/you') && "black"}`} />
            <Link
              to="/you"
              className={`w-full text-lg block cursor-pointer py-3 font-light`}
            >
              You
            </Link>
          </li>
          <li className={`flex items-center gap-3 mb-2 px-4 ${isActive('/resource-finder')}`}>
            <PiVideoLight size={24} color={`${isActive('/resource-finder') && "black"}`} />
            <Link
              to="/resource-finder"
              className={`w-full text-lg block cursor-pointer py-3 font-light`}
            >
              Resource Finder
            </Link>
          </li>
          <li className={`flex items-center gap-3 mb-2 px-4 ${isActive('/report-explanation')}`}>
            <CiFileOn size={24} color={`${isActive('/report-explanation') && "black"}`} />
            <Link
              to="/report-explanation"
              className={`w-full text-lg block cursor-pointer py-3 font-light`}
            >
              Report Explanation
            </Link>
          </li>
          <li className={`flex items-center gap-3 mb-2 px-4 ${isActive('/chatbot')}`}>
            <IoChatboxOutline size={24} color={`${isActive('/chatbot') && "black"}`} />
            <Link
              to="/chatbot"
              className={`w-full text-lg block cursor-pointer py-3 font-light`}
            >
              Chatbot
            </Link>
          </li>
          <li className={`flex items-center gap-3 mb-2 px-4 ${isActive('/global-news')}`}>
            <PiNewspaperClippingLight size={24} color={`${isActive('/global-news') && "black"}`} />
            <Link
              to="/global-news"
              className={`w-full text-lg block cursor-pointer py-3 font-light`}
            >
              News
            </Link>
          </li>
          <li className={`flex items-center gap-3 mb-2 px-4 ${isActive('/appointment')}`}>
            <PiAddressBookLight size={24} color={`${isActive('/appointment') && "black"}`} />
            <Link
              to="/appointment"
              className={`w-full text-lg block cursor-pointer py-3 font-light`}
            >
              Appointment
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-auto">
        <ul>
          <li className="flex items-center gap-2 mb-2 p-3">
            <PiSignOutLight size={24} />
            <Link
              onClick={handleLogout}
              to="/auth"
              className={`text-base block cursor-pointer`}
            >
              Log Out
            </Link>
          </li>
        </ul>
      </div>
    </div> */}