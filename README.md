# Frontend GitHub: [https://github.com/R3yz0n/news-portal-frontend](https://github.com/R3yz0n/news-portal-frontend)

# News Portal Backend

This is the backend server for the News Portal project.

## Features

- RESTful API for news, categories, users, advertisements, and more
- Sequelize ORM for database management
- JWT authentication and authorization
- Validation middleware for request data
- Modular controllers and routes

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `config/config.js`.
3. Run database migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```
4. Seed the database (optional):
   ```bash
   npx sequelize-cli db:seed:all
   ```
5. Start the server:
   ```bash
   npm start
   ```

## Folder Structure

- `config/` - Configuration files
- `controller/` - API controllers
- `middlerware/` - Middleware for validation and authentication
- `models/` - Sequelize models
- `routes/` - API routes
- `migrations/` - Database migration scripts
- `seeders/` - Database seed scripts
- `utils/` - Utility functions

## API Endpoints

See `routes/` for available endpoints.

## License

MIT
