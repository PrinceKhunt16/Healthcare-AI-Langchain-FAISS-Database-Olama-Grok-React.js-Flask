import React, { useState, useEffect } from 'react'
import "./index.css"
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineDone } from "react-icons/md";

const Appointment = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [liberatedAppointments, setLiberatedAppointments] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [appointmentsDoctorDetails, setAppointmentsDoctorDetails] = useState([]);
  const [showDoctorAppointments, setShowDoctorAppointments] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [duration, setDuration] = useState('');

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const fetchPerticularDoctorAppointments = async (mailid) => {
    setShowDoctorAppointments(true);

    try {
      const response = await fetch(`http://127.0.0.1:5000/appointments/${mailid}`);

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setDoctorAppointments(data.appointments.filter(app => !app.booked));
      setAppointmentsDoctorDetails(data.user);
    } catch (err) {
      console.log(err.message);
    }

  }

  const handleSearchDoctors = () => {
    if (search === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter((doctor) => {
        const { name, health_info } = doctor;
        const { degree, clinicAddress, city, specialization } = health_info;

        return (
          name.toLowerCase().includes(search.toLowerCase()) ||
          degree.toLowerCase().includes(search.toLowerCase()) ||
          clinicAddress.toLowerCase().includes(search.toLowerCase()) ||
          city.toLowerCase().includes(search.toLowerCase()) ||
          specialization.toLowerCase().includes(search.toLowerCase())
        );
      });

      setFilteredDoctors(filtered);
    }
  };

  const handleApprovedAppointment = async (id, status) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/appointments/not-approved/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: status }),
      });

      if (response.ok) {
        await response.json();
        await fetchAppointments();
      } else {
        console.error('Error');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleBookAppointment = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/appointments/book/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mailid: user.mailid,
        }),
      });

      if (response.ok) {
        setShowDoctorAppointments(false);
      }

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateAppointment = async () => {
    const appointmentData = {
      appointmentDate,
      appointmentTime,
      duration,
      mailid: user.mailid,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/create-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        await response.json();
        handleClosePopup();
      } else {
        const error = await response.json();
        console.error('Error', error.message);
      }
    } catch (error) {
      console.error('Error', error);
    }
  }

  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return new Date(date).toLocaleDateString('en-US', options);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/doctors');
      const data = await response.json();

      if (response.ok) {
        setDoctors(data.doctors);
        setFilteredDoctors(data.doctors);
      } else {
        console.error('Failed to fetch doctors:', data.message);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/appointments/${user.mailid}`);

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data.appointments);
      setBookedAppointments(data.appointments.filter(app => app.booked));
      setLiberatedAppointments(data.appointments.filter(app => !app.booked));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100/50 to-blue-200 min-h-screen text-black text-lg font-normal">
      {user.role == "Patient" ? (
        <div>
          <div className="max-w-xl mx-auto mb-6">
            <div className="w-full flex justify-center">
              <div className="flex items-center w-full max-w-xl relative">
                <input
                  type="text"
                  placeholder="Search Appointment"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchDoctors();
                    }
                  }}
                  className="flex-grow pr-12 p-3 border-none rounded-full bg-slate-300 focus:outline-none placeholder-black text-lg shadow-xl"
                />
                <button
                  className="absolute right-2 bg-none text-white shadow-2xl font-normal text-base cursor-pointer"
                  onClick={handleSearchDoctors}
                >
                  <BsFillArrowDownCircleFill fontSize={34} color="#1f2937" />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="bg-slate-200/70 shadow-lg rounded-xl cursor-pointer" onClick={() => fetchPerticularDoctorAppointments(doctor.mailid)}>
                  <div className="w-full h-48">
                    <img
                      src={`http://127.0.0.1:5000/uploads/${doctor.profilePic}`}
                      alt={`Dr. ${doctor?.name}`}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                  </div>
                  <div className='m-4'>
                    <h2 className="text-xl font-bold mb-2">Dr. {doctor?.name} ({doctor.health_info.degree})</h2>
                    <p className="text-base mb-1">Workplace: {doctor.health_info.clinicAddress}, {doctor.health_info.city}</p>
                    <p className="text-base mb-1">Specialization: {doctor.health_info.specialization}</p>
                    <p className="text-base mb-1">Experience: {doctor.health_info.yearsOfExperience} Years</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No doctors found.</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className='flex justify-between'>
            <h1 className="text-4xl font-medium mb-8">Appointment</h1>
            <div>
              <button className='bg-slate-400/50 hover:bg-slate-400/70  w-[40px] h-[40px] flex justify-center items-center rounded-full' onClick={handleOpenPopup}>
                <AiOutlinePlus size={24} />
              </button>
            </div>
          </div>
          <div className='mb-8'>
            <h3 className="text-3xl font-medium mb-4">Booked</h3>
            {bookedAppointments.length > 0 ? (
              <table className="rounded-xl bg-white w-full overflow-hidden">
                <thead>
                  <tr>
                    <th className="bg-slate-300 border-b border-r border-slate-200 p-4">Date</th>
                    <th className="bg-slate-300 border-b border-r border-slate-200 p-4">Time</th>
                    <th className="bg-slate-300 border-b border-r border-slate-200 p-4">Duration</th>
                    <th className="bg-slate-300 border-b border-r border-slate-200 p-4">Mail-id</th>
                    <th className="bg-slate-300 border-b border-slate-200 p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedAppointments.map((appointment, index) => (
                    <tr key={appointment._id} className={`${index !== bookedAppointments.length - 1 ? "border-b border-slate-200" : ""}`}>
                      <td className={`${index !== bookedAppointments.length - 1 ? "border-r" : "border-r"} border-slate-200 p-3`}>
                        {formatDate(appointment.appointmentDate)}
                      </td>
                      <td className={`${index !== bookedAppointments.length - 1 ? "border-r" : "border-r"} border-slate-200 p-3`}>
                        {formatTime(appointment.appointmentTime)}
                      </td>
                      <td className={`${index !== bookedAppointments.length - 1 ? "border-r" : "border-r"} border-slate-200 p-3`}>
                        {appointment.duration} minutes
                      </td>
                      <td className={`${index !== bookedAppointments.length - 1 ? "border-r" : "border-r"} border-slate-200 p-3`}>
                        {appointment.userMailid}
                      </td>
                      <td
                        className={`${index !== bookedAppointments.length - 1 ? "" : ""} border-slate-200 p-3 cursor-pointer flex items-center justify-center`}
                        onClick={() => handleApprovedAppointment(appointment._id, !appointment.approved)}
                      >
                        <p className={`w-fit rounded-full p-2 ${appointment.approved ? "bg-slate-300 hover:bg-slate-400/70" : "bg-red-200"} cursor-pointer`}>
                          <MdOutlineDone size={24} />
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No appointments.</p>
            )}
          </div>
          <div className='mb-8'>
            <h3 className="text-3xl font-medium mb-4">Liberated</h3>
            {liberatedAppointments.length > 0 ? (
              <table className="rounded-xl bg-white border-collapse w-full overflow-hidden">
                <thead>
                  <tr>
                    <th className="bg-slate-300 border-b border-r border-slate-200 p-4">Date</th>
                    <th className="bg-slate-300 border-b border-r border-slate-200 p-4">Time</th>
                    <th className="bg-slate-300 border-b border-slate-200 p-4">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {liberatedAppointments.map((appointment, index) => (
                    <tr key={appointment._id}>
                      <td className={`${index !== liberatedAppointments.length - 1 ? "border-b border-r" : "border-r"} border-slate-200 p-4`}>
                        {formatDate(appointment.appointmentDate)}
                      </td>
                      <td className={`${index !== liberatedAppointments.length - 1 ? "border-b border-r" : "border-r"} border-slate-200 p-4`}>
                        {formatTime(appointment.appointmentTime)}
                      </td>
                      <td className={`${index !== liberatedAppointments.length - 1 ? "border-b" : ""} border-slate-200 p-4`}>
                        {appointment.duration} minutes
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No appointments.</p>
            )}
          </div>
        </div>
      )}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Appointment</h2>
            <div className='mb-4'>
              <div className="mb-4">
                <label className="block text-base font-medium mb-2">Appointment Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div><div className="mb-4">
                <label className="block text-base font-medium mb-2">Appointment Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-base font-medium mb-2">Duration (in minutes)</label>
                <input
                  type="number"
                  placeholder="Enter duration in minutes"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
            <div className='flex gap-6'>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 hover:bg-red-600"
                onClick={handleClosePopup}
              >
                Close
              </button>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
                onClick={handleCreateAppointment}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {showDoctorAppointments && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">{appointmentsDoctorDetails.name}'s Appointments</h2>
            {doctorAppointments.length > 0 ? (
              <table className="border-collapse border border-gray-300 w-full">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">Time</th>
                    <th className="border border-gray-300 p-2">Duration</th>
                    <th className="border border-gray-300 p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorAppointments.map((appointment) => (
                    <>
                      {appointment.booked == false && (
                        <tr key={appointment._id}>
                          <td className="border border-gray-300 p-2">{formatDate(appointment.appointmentDate)}</td>
                          <td className="border border-gray-300 p-2">{formatTime(appointment.appointmentTime)}</td>
                          <td className="border border-gray-300 p-2">{appointment.duration} minutes</td>
                          <td className="border border-gray-300 p-2 bg-blue-400 cursor-pointer text-center" onClick={() => handleBookAppointment(appointment._id)}>Book</td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No appointments.</p>
            )}
            <div className='flex gap-6'>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 hover:bg-red-600"
                onClick={() => setShowDoctorAppointments(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointment