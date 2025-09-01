# Sticky Parkur

Sticky Parkur is an engaging platform game where players navigate through various levels, overcoming obstacles and challenges. This README provides an overview of the project, setup instructions, and gameplay details.

## Project Structure

```
sticky-parkur
├── src
│   ├── index.html          # HTML structure of the game
│   ├── styles.css         # CSS styles for the game
│   ├── js
│   │   ├── game.js        # Main game logic
│   │   ├── menu.js        # Main menu functionality
│   │   ├── settings.js     # Settings panel management
│   │   ├── admin.js       # Admin panel functionality
│   │   ├── store.js       # In-game store management
│   │   └── utils.js       # Utility functions
│   └── assets
│       └── audio          # Audio files for the game
├── package.json           # npm configuration file
├── .gitignore             # Git ignore file
└── README.md              # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sticky-parkur
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the game:**
   Open `src/index.html` in your web browser to start playing.

## Gameplay Details

- **Controls:**
  - Player 1: A/D (move), W (jump), E (extend arm)
  - Player 2: Left/Right arrow keys (move), Up arrow key (jump)

- **Admin Access:**
  To access the admin panel, enter the code "3141" in the main menu before starting the game.

- **Settings:**
  Players can adjust settings such as starting level and volume from the settings panel.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.