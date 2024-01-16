# Lottery Service

A microservice for managing lottery draws, part of the QuPot platform. This service handles the creation, management, and execution of lottery draws with quantum-enhanced number generation capabilities.

## Overview

The Lottery Service provides a RESTful API for managing lottery draws, including features for creating draws, managing their lifecycle, and generating winning numbers. It's designed to be part of a larger microservices architecture and can be integrated with quantum number generation services.

## Features

- Create and manage lottery draws
- Draw lifecycle management (Pending → In Progress → Completed/Cancelled)
- Quantum-enhanced number generation (planned)
- RESTful API with Swagger documentation
- TypeScript-based implementation
- NestJS framework

## API Documentation

The API documentation is available at `http://localhost:8003/api` when the service is running.

### Endpoints

| Method | Endpoint                | Description                          |
| ------ | ----------------------- | ------------------------------------ |
| POST   | `/lottery`              | Create a new draw                    |
| GET    | `/lottery`              | Get all draws                        |
| GET    | `/lottery/:id`          | Get a specific draw                  |
| PATCH  | `/lottery/:id`          | Update a draw                        |
| DELETE | `/lottery/:id`          | Delete a draw                        |
| POST   | `/lottery/:id/start`    | Start a draw                         |
| POST   | `/lottery/:id/complete` | Complete a draw with winning numbers |
| POST   | `/lottery/:id/cancel`   | Cancel a draw                        |

## For Developers

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TypeScript knowledge
- Understanding of NestJS framework

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

To run the service in development mode:

```bash
npm run dev
```

The service will start on port 8003.

### Testing

Run the test suite:

```bash
npm test
```

### Project Structure

```
src/
├── lottery/
│   ├── dto/
│   │   ├── create-draw.dto.ts
│   │   └── update-draw.dto.ts
│   ├── interfaces/
│   │   └── draw.interface.ts
│   ├── lottery.controller.ts
│   ├── lottery.module.ts
│   └── lottery.service.ts
├── app.module.ts
└── main.ts
```

## For Builders

### Building the Service

To build the service for production:

```bash
npm run build
```

### Running in Production

```bash
npm run start:prod
```

### Environment Variables

The service currently uses default configurations. Future versions may include environment variables for:

- Port configuration
- Database connection
- Quantum service integration
- Security settings

## For Users

### API Usage

1. **Creating a Draw**

```bash
curl -X POST http://localhost:8003/lottery \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekly Draw",
    "description": "Weekly lottery draw",
    "startDate": "2024-03-20T00:00:00Z",
    "endDate": "2024-03-27T00:00:00Z"
  }'
```

2. **Starting a Draw**

```bash
curl -X POST http://localhost:8003/lottery/{draw-id}/start
```

3. **Completing a Draw**

```bash
curl -X POST http://localhost:8003/lottery/{draw-id}/complete \
  -H "Content-Type: application/json" \
  -d '{
    "winningNumbers": [1, 2, 3, 4, 5, 6]
  }'
```

### Draw States

1. **PENDING**: Initial state when a draw is created
2. **IN_PROGRESS**: Draw is active and accepting entries
3. **COMPLETED**: Draw has been finished with winning numbers
4. **CANCELLED**: Draw has been cancelled before completion

## Future Enhancements

- Integration with quantum number generation service
- Database persistence
- Authentication and authorization
- Rate limiting
- Monitoring and logging
- Docker containerization
- Kubernetes deployment support

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
