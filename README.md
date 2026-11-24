## SalonBook Server
Backend API for SalonBook, a salon service booking platform. The
server handles authentication, user and service data, appointment
management, and related API operations.
## Features
- RESTful API built with Express.js
- MongoDB database integration
- JWT authentication and role-based authorization
- User management
- Salon service management
- Appointment creation and management
- Customers can cancel their own pending appointments
- Appointment and payment status management
- Error handling
## Technology Stack
- Node.js
- Express.js
- MongoDB
- JavaScript
- JWT
- jose for JWT verification with remote JWKS
Prerequisites
- Node.js
- npm or pnpm
- MongoDB database
## Installation
Clone the server repository:
git clone <SERVER_REPOSITORY_URL>
cd <SERVER_PROJECT_FOLDER>
## Install dependencies:
pnpm install
If the project uses npm, run npm install instead.
Environment Variables
Create a .env file in the server root directory and configure these
variables:
PORT=
MONGODB_URL=
CLIENT_URL=
Never commit your .env file or publish secret values.
Run Locally
Start the development server:
pnpm run dev
Check the scripts section in package.json if your development
command is different.

The API will be available at:
http://localhost:<PORT>
API Modules
The server provides API endpoints for:
- Authentication and authorization
- Users
- Services
- Appointments
- Payments and transactions
For complete endpoint details, refer to the route files in the source
code.
## Live Links
- Live Website: https://salon-book-phi.vercel.app
## Repository Links
- Client Repository: https://github.com/sazzad10023/SalonBook
- Server Repository: https://github.com/sazzad10023/Salon-server

## Security
- Keep environment variables and credentials private.
- Protected routes require a valid authentication token.
- Role-based middleware restricts access to authorized users.
- Customers can cancel only their own appointments when the status is
  Pending.