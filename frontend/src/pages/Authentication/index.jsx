import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
    const [authrCheck, setAuthrCheck] = useState(false);
    const [canGoForHelthInfo, setCanGoForHelthInfo] = useState(false);
    const [user, setUser] = useState(localStorage.getItem('user'));
    const [name, setName] = useState('Prince Khunt');
    const [mailid, setMailid] = useState('princekhunt@gmail.com');
    const [password, setPassword] = useState('princekhunt');
    const [role, setRole] = useState('Patient');
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
    const [specialization, setSpecialization] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [certifications, setCertifications] = useState('');
    const [clinicAddress, setClinicAddress] = useState('');
    const [consultationFee, setConsultationFee] = useState('');
    const [city, setCity] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('Choose file');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : 'Choose file');
    };

    const handleHealthInfo = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('user'));
        const mailid = user?.mailid;

        if (!mailid) {
            console.error('User not found in localStorage.');
            return;
        }

        const healthData = {
            mailid,
            dob,
            gender,
            height,
            weight,
            medications,
            allergies,
            smoking,
            alcohol,
            emergencyContact,
            healthGoals
        };

        if (user.role === 'Doctor') {
            Object.assign(healthData, {
                degree,
                specialization,
                yearsOfExperience,
                certifications,
                clinicAddress,
                consultationFee,
                city,
                portfolioUrl
            });
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/healthinfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(healthData)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
                window.location.reload();
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting health information:', error);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();

        const url = authrCheck ? 'http://127.0.0.1:5000/register' : 'http://127.0.0.1:5000/login';

        const data = {
            mailid,
            password
        };

        if (authrCheck) {
            data.name = name;
            data.role = role;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('auth', true);
                localStorage.setItem('user', JSON.stringify(result.user));

                if (authrCheck) {
                    setUser(result.user);
                    await handleUpload();
                    setCanGoForHelthInfo(true);
                } else {
                    navigate('/');
                    window.location.reload();
                }
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleUpload = async () => {
        if (!file) return;
        const user = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();
        formData.append('profilePic', file);
        formData.append('mailid', user?.mailid);

        try {
            const response = await fetch('http://127.0.0.1:5000/uploadprofilepic', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            {canGoForHelthInfo ?
                (
                    <form
                        className="max-w-lg w-full bg-white p-6 shadow-md my-10 rounded-xl"
                        onSubmit={(e) => handleHealthInfo(e)}
                    >
                        <h2 className="text-2xl mb-6 text-center">Health Information</h2>
                        <input
                            type="date"
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            placeholder="Date of Birth"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                        <select
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <input
                            type="number"
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            placeholder="Height (cm)"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                        <input
                            type="number"
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            placeholder="Weight (kg)"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                        <input
                            type="text"
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            placeholder="Medications"
                            value={medications}
                            onChange={(e) => setMedications(e.target.value)}
                        />
                        <input
                            type="text"
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            placeholder="Allergies"
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                        />
                        <select
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            value={smoking}
                            onChange={(e) => setSmoking(e.target.value)}
                        >
                            <option value="">Do you smoke?</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <select
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            value={alcohol}
                            onChange={(e) => setAlcohol(e.target.value)}
                        >
                            <option value="">Do you consume alcohol?</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <input
                            type="text"
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            placeholder="Emergency Contact"
                            value={emergencyContact}
                            onChange={(e) => setEmergencyContact(e.target.value)}
                        />
                        <input
                            type="text"
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            placeholder="Health Goals"
                            value={healthGoals}
                            onChange={(e) => setHealthGoals(e.target.value)}
                        />
                        {user.role === 'Doctor' && (
                            <>
                                <input
                                    type="text"
                                    className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                                    placeholder="Degree"
                                    value={degree}
                                    onChange={(e) => setDegree(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                                    placeholder="Specialization"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                                    placeholder="Years of Experience"
                                    value={yearsOfExperience}
                                    onChange={(e) => setYearsOfExperience(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                                    placeholder="Certifications"
                                    value={certifications}
                                    onChange={(e) => setCertifications(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                                    placeholder="Consultation Fee"
                                    value={consultationFee}
                                    onChange={(e) => setConsultationFee(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                                    placeholder="Hospital/Clinic Address"
                                    value={clinicAddress}
                                    onChange={(e) => setClinicAddress(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                                    placeholder="Portfolio URL"
                                    value={portfolioUrl}
                                    onChange={(e) => setPortfolioUrl(e.target.value)}
                                />
                            </>
                        )}
                        <button className="bg-gray-500 rounded hover:bg-gray-600 font-bold text-sm text-white p-4 w-full" type="submit">
                            SUBMIT
                        </button>
                    </form>
                ) : (
                    <form
                        className={`max-w-lg rounded-xl w-full bg-white p-6 shadow-md transition-all duration-500 ease-in-out ${authrCheck ? 'min-h-[426px]' : 'min-h-[312px]'}`}
                        onSubmit={(e) => handleAuth(e)}
                    >
                        <h2 className="text-2xl text-center mb-6 transition-all duration-500 ease-in-out">
                            {authrCheck ? 'REGISTER' : 'LOGIN'}
                        </h2>
                        {authrCheck && (
                            <div className="transition-all duration-500 ease-in-out">
                                <input
                                    type="text"
                                    className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div className="flex justify-between mb-4">
                                    <button
                                        type="button"
                                        className={`w-1/2 p-2 border-none ${role === 'Patient' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                                        onClick={() => setRole('Patient')}
                                    >
                                        Patient
                                    </button>
                                    <button
                                        type="button"
                                        className={`w-1/2 p-2 border-none ${role === 'Doctor' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                                        onClick={() => setRole('Doctor')}
                                    >
                                        Doctor
                                    </button>
                                </div>
                                <label className="flex items-center border border-gray-300 p-2 mb-4 w-full cursor-pointer bg-gray-300 hover:bg-gray-400">
                                    <span className="flex-1 text-center">{fileName}</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        )}
                        <input
                            type="text"
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            placeholder="Mail-id"
                            value={mailid}
                            onChange={(e) => setMailid(e.target.value)}
                        />
                        <input
                            type="password"
                            className="border border-gray-300 p-2 mb-4 w-full focus:border-gray-500  outline-none rounded"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="bg-gray-500 rounded hover:bg-gray-600 font-bold text-sm text-white p-4 w-full" type="submit">
                            {authrCheck ? 'REGISTER' : 'LOGIN'}
                        </button>
                        <div className="mt-4 text-center transition-all duration-500">
                            <button
                                type="button"
                                className="text-gray-500"
                                onClick={() => setAuthrCheck(!authrCheck)}
                            >
                                {authrCheck ? 'Already have an account? LOGIN' : "Don't have an account? REGISTER"}
                            </button>
                        </div>
                    </form>
                )}
        </div>
    )
}

export default Authentication