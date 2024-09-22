import React, { useState, useEffect } from 'react';
import { MdOutlineDone } from "react-icons/md";
import './index.css';

const You = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [name, setName] = useState('');
  const [mailid, setMailid] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [smoking, setSmoking] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [healthGoals, setHealthGoals] = useState('');
  const [degree, setDegree] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [certifications, setCertifications] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);

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

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMailid(user.mailid || '');
      setDob(user.health_info.dob || '');
      setGender(user.health_info.gender || '');
      setHeight(user.health_info.height || '');
      setWeight(user.health_info.weight || '');
      setMedications(user.health_info.medications || '');
      setAllergies(user.health_info.allergies || '');
      setSmoking(user.health_info.smoking || '');
      setAlcohol(user.health_info.alcohol || '');
      setEmergencyContact(user.health_info.emergencyContact || '');
      setHealthGoals(user.health_info.healthGoals || '');
      setRole(user.role || '');
      setProfilePic(user.profilePic || '');

      if (user.role === 'Doctor') {
        setDegree(user.health_info.degree || '');
        setClinicAddress(user.health_info.clinicAddress || '');
        setCity(user.health_info.city || '');
        setPortfolioUrl(user.health_info.portfolioUrl || '');
        setCertifications(user.health_info.certifications || '');
        setConsultationFee(user.health_info.consultationFee || '');
        setSpecialization(user.health_info.specialization || '');
        setYearsOfExperience(user.health_info.yearsOfExperience || '');
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchDoctorsAppointments = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/appointments/${user.mailid}`);

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        setAppointments(data.appointments);
        setBookedAppointments(data.appointments.filter(app => app.booked));
      } catch (err) {
        console.log(err.message);
      }
    };

    const fetchPatientsAppointments = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/patient-appointments/${user.mailid}`);

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();

        setAppointments(data.appointments);
        setBookedAppointments(data.appointments.filter(app => app.booked));
      } catch (err) {
        console.log(err.message);
      }
    };

    if (user.role == "Doctor") {
      fetchDoctorsAppointments();
    } else {
      fetchPatientsAppointments()
    }

  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100/50 to-blue-200 min-h-screen text-black font-light">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Information</h2>
          <div className="bg-white rounded-xl min-w-full text-lg overflow-hidden">
            <div className="border-b border-slate-200 flex">
              <div className="pt-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Profile Picture</div>
              <div className="w-2/3">
                <img
                  src={`http://127.0.0.1:5000/uploads/${profilePic}`}
                  alt="Profile Picture"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="border-b border-slate-200 flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Name</div>
              <div className="py-2 pl-2 w-2/3">{name}</div>
            </div>
            <div className="border-b border-slate-200 flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Mail-id</div>
              <div className="py-2 pl-2 w-2/3">{mailid}</div>
            </div>
            <div className="border-b border-slate-200 flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Date of Birth</div>
              <div className="py-2 pl-2 w-2/3">{dob}</div>
            </div>
            <div className="flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Role</div>
              <div className="py-2 pl-2 w-2/3">{role}</div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Health Information</h2>
          <div className="bg-white rounded-xl min-w-full text-lg overflow-hidden">
            <div className="border-b border-slate-200 flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Gender</div>
              <div className="py-2 pl-2 w-2/3">{gender}</div>
            </div>
            <div className="border-b border-slate-200 flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Height</div>
              <div className="py-2 pl-2 w-2/3">{height}</div>
            </div>
            <div className="border-b border-slate-200 flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Weight</div>
              <div className="py-2 pl-2 w-2/3">{weight}</div>
            </div>
            <div className="border-b border-slate-200 flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Medications</div>
              <div className="py-2 pl-2 w-2/3">{medications}</div>
            </div>
            <div className="border-b border-slate-200 flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Allergies</div>
              <div className="py-2 pl-2 w-2/3">{allergies}</div>
            </div>
            <div className="border-b border-slate-200 flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Smoking</div>
              <div className="py-2 pl-2 w-2/3">{smoking}</div>
            </div>
            <div className="border-b border-slate-200 flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Alcohol</div>
              <div className="py-2 pl-2 w-2/3">{alcohol}</div>
            </div>
            <div className="border-b border-slate-200 flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Emergency Contact</div>
              <div className="py-2 pl-2 w-2/3">{emergencyContact}</div>
            </div>
            <div className="flex">
              <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Health Goals</div>
              <div className="py-2 pl-2 w-2/3">{healthGoals}</div>
            </div>
          </div>
        </div>
        {user.role == "Doctor" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Professional Information</h2>
            <div className="bg-white rounded-xl min-w-full text-lg overflow-hidden">
              <div className="border-b border-slate-200 flex">
                <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Degree</div>
                <div className="py-2 pl-2 w-2/3">{degree}</div>
              </div>
              <div className="border-b border-slate-200 flex">
                <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Hospital</div>
                <div className="py-2 pl-2 w-2/3">{clinicAddress}</div>
              </div>
              <div className="border-b border-slate-200 flex">
                <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">City</div>
                <div className="py-2 pl-2 w-2/3">{city}</div>
              </div>
              <div className="border-b border-slate-200 flex">
                <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3 break-words">Certifications</div>
                <div className="py-2 pl-2 w-2/3 break-words">{certifications}</div>
              </div>
              <div className="border-b border-slate-200 flex">
                <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3 break-words">Specialization</div>
                <div className="py-2 pl-2 w-2/3 break-words">{specialization}</div>
              </div>
              <div className="border-b border-slate-200 flex">
                <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Experience (Years)</div>
                <div className="py-2 pl-2 w-2/3">{yearsOfExperience}</div>
              </div>
              <div className="border-b border-slate-200 flex">
                <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3 break-words">Consultation Fee</div>
                <div className="py-2 pl-2 w-2/3">{consultationFee}</div>
              </div>
              <div className="flex">
                <div className="py-2 pl-2 font-semibold pr-4 bg-slate-300 border-r border-slate-200 w-1/3">Portfolio URL</div>
                <div className="py-2 pl-2 w-2/3 break-words">{portfolioUrl}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <h4 className='text-2xl mb-6'>Next Appointments</h4>
        {bookedAppointments.length > 0 ? (
          <table className="text-lg rounded-xl bg-white w-full overflow-hidden">
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
                  >
                    <p className={`w-fit rounded-full p-2 ${appointment.approved ? "bg-slate-300" : "bg-red-200"} cursor-pointer flex items-center justify-center`}>
                      <MdOutlineDone size={24} />
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='text-xl'>No appointments.</p>
        )}
      </div>
    </div>
  );
};

export default You;