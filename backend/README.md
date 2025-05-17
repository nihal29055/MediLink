# Project Title: MedRepo

## Description
MedRepo is a backend application designed to manage medical records, including user authentication, doctor profiles, patient records, and report management. It utilizes Express.js for the server framework and MongoDB for data storage.

## Features
- User authentication (signup and login)
- Doctor profile management
- Patient record management
- Report creation and retrieval
- Natural language processing for text summarization

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install the required dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the backend directory and add your environment variables:
   ```
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   PORT=<your_preferred_port>
   ```

## Usage
1. Start the server:
   ```
   npm start
   ```
2. The server will run on the specified port (default is 5000). You can access the API at `http://localhost:<port>/`.

## API Endpoints
### Authentication
- **POST /api/auth/signup**: Create a new user.
- **POST /api/auth/login**: Authenticate a user and return a JWT.

### Doctor
- **GET /api/doctor/profile**: Retrieve the authenticated doctor's profile.

### Patient
- **POST /api/patient**: Create a new patient record.
- **GET /api/patient/:id**: Retrieve a patient record by ID.

### Reports
- **POST /api/report**: Create a new report.
- **GET /api/report/:id**: Retrieve a report by ID.

### NLP
- **POST /api/nlp/summarize**: Summarize text using NLP techniques.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.