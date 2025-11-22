GoWheels is a peer-to-peer bike rental platform that connects bike owners with renters.

🏗 Project Structure

This project is organized as a monorepo containing both the frontend and backend:

gowheels-frontend/: React application (created with Create React App).

gowheels-backend/: Django REST Framework API.

🚀 Getting Started

Follow these instructions to set up the project on your local machine.

Prerequisites

Node.js (v14 or higher)

Python (v3.8 or higher)

Git

1. Backend Setup (Django)

Navigate to the backend folder and set up the Python environment.

# 1. Go to backend folder
cd gowheels-backend

# 2. Create Virtual Environment
# Windows:
python -m venv venv
# Mac/Linux:
python3 -m venv venv

# 3. Activate Virtual Environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. Install Dependencies
pip install django djangorestframework django-cors-headers

# 5. Run Migrations and Start Server
python manage.py migrate
python manage.py runserver


The API will be running at: http://127.0.0.1:8000/

2. Frontend Setup (React)

Open a new terminal (keep the backend running) and navigate to the frontend folder.

# 1. Go to frontend folder
cd gowheels-frontend

# 2. Install Dependencies
npm install

# 3. Start the React Dev Server
npm start


The app will open at: http://localhost:3000/

🛠 Tech Stack

Frontend:

React.js

CSS3 (Custom Styling)

SVG Icons

Backend:

Django

Django REST Framework

SQLite (Default Database)
