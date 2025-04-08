# Uber Clone Microservices Architecture

A scalable Uber clone built using microservices architecture with Node.js, Express, MongoDB, and RabbitMQ for message queuing.

## Architecture Overview

The application consists of four main microservices:

1. **API Gateway** (Port 3000)
   - Entry point for all client requests
   - Routes requests to appropriate services
   - Handles authentication and request validation

2. **User Service** (Port 3001)
   - Manages user accounts and profiles
   - Handles user authentication
   - Maintains ride history for users

3. **Captain Service** (Port 3002)
   - Manages driver (captain) accounts
   - Handles captain availability
   - Processes ride assignments
   - Tracks earnings and performance

4. **Ride Service** (Port 3003)
   - Manages ride lifecycle
   - Handles ride requests and matching
   - Processes ride status updates
   - Maintains ride history

## Technologies Used

- Node.js & Express.js
- MongoDB (Database)
- RabbitMQ (Message Queue)
- JWT (Authentication)


## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- RabbitMQ Server
- npm or yarn

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/AB-Code-Hub/Micro-Services.git
cd Micro-Services
```

2. Install dependencies for each service:
```bash
cd gateway && npm install
cd ../user && npm install
cd ../captain && npm install
cd ../ride && npm install
```

3. Configure environment variables:
Create `.env` file in each service directory with the following variables:
```env
PORT=<service-port>
MONGODB_URI=mongodb://localhost:27017/<service-name>
JWT_SECRET=your-secret-key
RABBITMQ_URL=amqp://localhost
```

4. Start the services:
```bash
# Start each service in a separate terminal
npm start
```

## API Endpoints

### User Service (3001)

#### Authentication
- `POST /api/users/register` - Register new user
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "phone": "string"
  }
  ```
- `POST /api/users/login` - User login
- `GET /api/users/logout` - User logout
- `GET /api/users/profile` - Get user profile

#### Rides

- `GET /api/users/rides/active` - Get active ride


### Captain Service (3002)

#### Authentication
- `POST /api/captains/register` - Register new captain
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "phone": "string",
    "vehicleDetails": {
      "model": "string",
      "color": "string",
      "plateNumber": "string"
    }
  }
  ```
- `POST /api/captains/login` - Captain login
- `GET /api/captains/logout` - Captain logout
- `GET /api/captains/profile` - Get captain profile

#### Rides
- `PATCH /api/captains/toggle-availability` - Toggle availability
- `GET /api/captains/rides/active` - Get active ride
- `POST /api/captains/rides/start` - Start ride
- `POST /api/captains/rides/complete` - Complete ride
statistics

### Ride Service (3003)

#### Ride Management
- `POST /api/rides/create` - Create new ride
- `PUT /api/rides/accept` - Accept ride request
- `POST /api/rides/cancel` - Cancel ride
- `PATCH /api/rides/complete` - Complete ride
- `GET /api/rides/nearby-captains` - Get nearby available captains

## Data Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  phone: String,
  profilePicture: String,
  rating: Number,
  paymentMethods: Array,
  emergencyContacts: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Captain Model
```javascript
{
  name: String,
  email: String,
  password: String,
  phone: String,
  vehicleDetails: {
    model: String,
    color: String,
    plateNumber: String
  },
  currentLocation: {
    type: {type: String, enum: ['Point']},
    coordinates: [Number]
  },
  isAvailable: Boolean,
  rating: Number,
  totalTrips: Number,
  documents: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Ride Model
```javascript
{
  userId: ObjectId,
  captainId: ObjectId,
  status: String,
  pickupLocation: {
    type: {type: String, enum: ['Point']},
    coordinates: [Number]
  },
  dropLocation: {
    type: {type: String, enum: ['Point']},
    coordinates: [Number]
  },
  fare: Number,
  distance: Number,
  duration: Number,
  paymentStatus: String,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Message Queue Events

RabbitMQ is used for asynchronous communication between services:

1. Ride Creation:
   - `ride.created` - Published when new ride is created
   - `ride.accepted` - Published when captain accepts ride

2. Location Updates:
   - `location.update.captain` - Published when captain location changes
   - `location.update.ride` - Published for ride progress updates

3. Ride Status:
   - `ride.started` - Published when ride starts
   - `ride.completed` - Published when ride ends
   - `ride.cancelled` - Published when ride is cancelled

## Error Handling

The application implements standardized error responses:

```javascript
{
  status: number,
  message: string,
  error: string,
  stack: string // Only in development
}
```

## Security Features

1. JWT Authentication
2. Request Rate Limiting
3. Input Validation
4. CORS Configuration
5. Helmet Security Headers
6. Password Hashing
7. Token Blacklisting

## Monitoring

The application includes:
- Request Logging
- Error Tracking
- Performance Metrics
- System Health Checks

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.