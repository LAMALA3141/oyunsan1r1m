# Sticky Parkur Game

## Overview
Sticky Parkur is an engaging platform game that allows players to navigate through various levels while overcoming obstacles. The game features a vibrant design, intuitive controls, and an admin panel for managing game settings and access codes.

## Project Structure
The project is organized into several directories and files:

- **src/**: Contains the source code for the game client, admin panel, and server.
  - **client/**: The main game client files.
    - `index.html`: The main HTML file for the game client.
    - `styles.css`: CSS styles for the game client.
    - `game.js`: JavaScript code for game logic.
    - **assets/**: Contains audio and sprite files used in the game.
  - **admin/**: The admin panel files for managing game settings.
    - `index.html`: The main HTML file for the admin panel.
    - `admin.css`: CSS styles for the admin panel.
    - `admin.js`: JavaScript code for admin panel functionality.
  - **server/**: The server-side code for handling requests and managing data.
    - `index.ts`: Entry point for the server application.
    - **controllers/**: Contains controller files for handling requests.
    - **routes/**: Defines the API routes for the admin panel.
    - **models/**: Contains data models for the application.
    - **services/**: Functions for managing access codes and other services.
    - **middleware/**: Middleware for authentication and authorization.
    - **utils/**: Utility functions for database interactions.
  - **shared/**: Contains shared types and interfaces.

- **config/**: Configuration files for environment variables.
- **scripts/**: Scripts for seeding the database and other tasks.
- **tests/**: Contains unit tests for both server and client functionalities.
- **package.json**: Lists dependencies and scripts for the project.
- **tsconfig.json**: TypeScript configuration file.
- **.gitignore**: Specifies files to be ignored by Git.
- **README.md**: Documentation for the project.

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd sticky-parkur
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Copy the `env.example` file to `.env` and update the values as needed.

4. **Run the Server**
   ```bash
   npm run start
   ```

5. **Access the Game**
   Open your browser and navigate to `http://localhost:3000` to play the game.

6. **Access the Admin Panel**
   Navigate to `http://localhost:3000/admin` to manage game settings and access codes.

## Features
- **Game Client**: Play through various levels with different characters.
- **Admin Panel**: Manage game settings, access codes, and player data.
- **Access Codes**: Use specific codes to unlock features like level access and infinite money.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.