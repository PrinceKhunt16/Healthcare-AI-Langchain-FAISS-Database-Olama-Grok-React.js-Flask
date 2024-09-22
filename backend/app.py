import os
import re
import sys
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'resource')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'chatbot')))

from recommender import Recommender
from Gemini import Gemini

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)
CONNECTION_STRING = "mongodb://localhost:27017/HCAI"
app.config["MONGO_URI"] = CONNECTION_STRING
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
db = PyMongo(app).db

def serialize_document(doc):
    if doc is not None:
        doc['_id'] = str(doc['_id']) 
    return doc

def secure_filename(filename):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    safe_filename = re.sub(r'[^\w\s.-]', '', filename)
    name, ext = os.path.splitext(safe_filename)

    if ext and not ext.startswith('.'):
        ext = '.' + ext

    new_filename = f"{timestamp}{ext}"
    
    return new_filename

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    mailid = data.get('mailid')
    password = data.get('password')
    role = data.get('role', 'Patient')

    if not name or not mailid or not password:
        return jsonify({"message": "Please provide name, mailid, and password"}), 400

    if db.users.find_one({"mailid": mailid}):
        return jsonify({"message": "Mailid already exists"}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    result = db.users.insert_one({
        "name": name,
        "mailid": mailid,
        "password": hashed_password,
        "role": role
    })

    user = db.users.find_one({"_id": result.inserted_id})
    user = serialize_document(user) 

    return jsonify({"message": "User registred", "user": user}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    mailid = data.get('mailid')
    password = data.get('password')

    if not mailid or not password:
        return jsonify({"message": "Please provide mailid and password"}), 400

    user = db.users.find_one({"mailid": mailid})

    if not user or not check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid credentials"}), 401

    user = serialize_document(user) 

    return jsonify({"message": "User logged in", "user": user}), 200

@app.route('/resource', methods=['POST'])
def resource():
    try:
        print("Resource")
        data = request.get_json()

        if not data or 'input' not in data:
            return jsonify({'error': 'parameter missing'}), 400

        input = data['input']
        response = Recommender(input)
        
        return jsonify({
            'input': input,
            'recommendations': response
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/chatbot', methods=['POST'])
def handle_prompt():
    data = request.get_json()

    if 'prompt' not in data:
        return jsonify({'error': 'parameter missing'}), 400
    
    prompt = data['prompt']
    response = Gemini(prompt)

    return jsonify({
        'prompt': prompt,
        'output': response
    })

@app.route('/healthinfo', methods=['POST'])
def health_info():
    data = request.json
    mailid = data.get('mailid')
    dob = data.get('dob')
    gender = data.get('gender')
    height = data.get('height')
    weight = data.get('weight')
    medications = data.get('medications')
    allergies = data.get('allergies')
    smoking = data.get('smoking')
    alcohol = data.get('alcohol')
    emergency_contact = data.get('emergencyContact')
    health_goals = data.get('healthGoals')
    degree = data.get('degree', '')
    specialization = data.get('specialization', '')
    years_of_experience = data.get('yearsOfExperience', '')
    certifications = data.get('certifications', '')
    consultation_fee = data.get('consultationFee', '')
    clinic_address = data.get('clinicAddress', '')
    city = data.get('city', '')
    portfolio_url = data.get('portfolioUrl', '')

    if not mailid:
        return jsonify({"message": "Please provide mailid"}), 400

    user = db.users.find_one({"mailid": mailid})

    if not user:
        return jsonify({"message": "User not found"}), 404

    health_info = {
        "dob": dob,
        "gender": gender,
        "height": height,
        "weight": weight,
        "medications": medications,
        "allergies": allergies,
        "smoking": smoking,
        "alcohol": alcohol,
        "emergencyContact": emergency_contact,
        "healthGoals": health_goals
    }

    if user.get("role") == 'Doctor':
        health_info.update({
            "degree": degree,
            "specialization": specialization,
            "yearsOfExperience": years_of_experience,
            "certifications": certifications,
            "consultationFee": consultation_fee,
            "clinicAddress": clinic_address,
            "city": city,
            "portfolioUrl": portfolio_url
        })

    if 'health_info' not in user:
        user['health_info'] = {}

    db.users.update_one({"mailid": mailid}, {"$set": {"health_info": health_info}})

    user = db.users.find_one({"mailid": mailid})
    user = serialize_document(user)

    return jsonify({"message": "Health information updated", "user": user}), 200

@app.route('/uploadprofilepic', methods=['POST'])
def upload_profile_pic():
    if 'profilePic' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['profilePic']
    mailid = request.form['mailid']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if not mailid:
        return jsonify({'message': 'Mail ID is required'}), 400

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])

        file.save(file_path)

        result = db.users.update_one(
            {"mailid": mailid},
            {"$set": {"profilePic": filename}}
        )

        if result.matched_count > 0:
            return jsonify({'message': 'File uploaded', 'filename': filename}), 200
        else:
            return jsonify({'message': 'User not found'}), 404

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    if not os.path.isfile(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
        return jsonify({"message": "File not found"}), 404
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = db.users.find({"role": "Doctor"})
    doctors_list = [serialize_document(doctor) for doctor in doctors]

    return jsonify({"message": "Doctors fetched", "doctors": doctors_list}), 200

@app.route('/create-appointment', methods=['POST'])
def create_appointment():
    data = request.json
    mailid = data.get('mailid')
    appointment_date = data.get('appointmentDate')
    appointment_time = data.get('appointmentTime')
    duration = data.get('duration')

    if not mailid or not appointment_date or not appointment_time or not duration:
        return jsonify({"message": "Please provide all required fields"}), 400

    try:
        datetime.strptime(appointment_date, "%Y-%m-%d")
        datetime.strptime(appointment_time, "%H:%M")
    except ValueError:
        return jsonify({"message": "Invalid date or time format"}), 400

    appointment = {
        "mailid": mailid,
        "appointmentDate": appointment_date,
        "appointmentTime": appointment_time,
        "duration": duration,
        "booked": False
    }

    result = db.appointments.insert_one(appointment)

    if result.inserted_id:
        return jsonify({"message": "Appointment created successfully", "appointmentId": str(result.inserted_id)}), 201
    else:
        return jsonify({"message": "Failed to create appointment"}), 500

@app.route('/appointments/<mailid>', methods=['GET'])
def get_appointments_for_doctor(mailid):
    if not mailid:
        return jsonify({"message": "Mail ID is required"}), 400

    user = db.users.find_one({"mailid": mailid})
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    user = serialize_document(user)
    appointments = db.appointments.find({"mailid": mailid})
    appointments_list = [serialize_document(appointment) for appointment in appointments]

    if appointments_list:
        return jsonify({"message": "Appointments fetched successfully", "user": user, "appointments": appointments_list}), 200
    else:
        return jsonify({"message": "No appointments found for the given mail ID"}), 404

@app.route('/patient-appointments/<mailid>', methods=['GET'])
def get_appointments_for_patients(mailid):
    if not mailid:
        return jsonify({"message": "Mail ID is required"}), 400

    appointments = db.appointments.find({"userMailid": mailid})
    appointments_list = [serialize_document(appointment) for appointment in appointments]

    if appointments_list:
        return jsonify({"message": "Appointments fetched successfully", "appointments": appointments_list}), 200
    else:
        return jsonify({"message": "No appointments found for the given mail ID"}), 404

@app.route('/appointments/book/<appointment_id>', methods=['POST'])
def book_appointment(appointment_id):
    data = request.json
    mailid = data.get('mailid')
    appointment_id = ObjectId(appointment_id)

    if not mailid:
        return jsonify({"message": "Mail ID is required"}), 400

    appointment = db.appointments.find_one({"_id": appointment_id})
    
    if not appointment:
        return jsonify({"message": "Appointment not found"}), 404

    if appointment.get("booked"):
        return jsonify({"message": "Appointment already booked"}), 400

    result = db.appointments.update_one(
        {"_id": appointment_id},
        {"$set": {"booked": True, "userMailid": mailid, "approved": False}}
    )

    if result.matched_count > 0:
        return jsonify({"message": "Appointment booked successfully"}), 200
    else:
        return jsonify({"message": "Failed to book appointment"}), 500

@app.route('/api/appointments/not-approved/<appointment_id>', methods=['POST'])
def not_approved_appointment(appointment_id):
    data = request.json
    approved = data.get('approved')
    appointment_id = ObjectId(appointment_id)

    if not appointment_id:
        return jsonify({"message": "Appointment ID is required"}), 400

    appointment = db.appointments.find_one({"_id": appointment_id})
    
    if not appointment:
        return jsonify({"message": "Appointment not found"}), 404

    result = db.appointments.update_one(
        {"_id": appointment_id},
        {"$set": {"approved": approved}} 
    )

    if result.matched_count > 0:
        return jsonify({"message": "Appointment status updated successfully"}), 200
    else:
        return jsonify({"message": "Failed to update appointment status"}), 500

if __name__ == '__main__':
    app.run(debug=True)