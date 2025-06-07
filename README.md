# 🏆 Professional Chess Game

A stunning, feature-rich chess game built with React featuring professional-grade gameplay, beautiful animations, and immersive sound effects.

![Chess Game Screenshot](https://via.placeholder.com/800x600/f5f5f5/333333?text=Chess+Game+Screenshot)

## ✨ Features

### 🎮 Complete Chess Experience
- **Full Chess Rules** - All piece movements (pawns, rooks, bishops, knights, queens, kings)
- **Move Validation** - Prevents illegal moves and ensures fair play
- **Turn-Based Gameplay** - Alternating white and black turns
- **Piece Capturing** - Click to capture opponent pieces
- **Win Conditions** - Game ends when king is captured or time runs out

### ⏰ Professional Timer System
- **3 Time Controls**: Blitz (5min), Rapid (10min), Classical (30min)
- **Real-time Countdown** - Live timer for active player
- **Low Time Warnings** - Visual and audio alerts when time is low
- **Time-based Victory** - Win when opponent runs out of time

### 💾 Game Management
- **5 Save Slots** - Save and load multiple games
- **Persistent Storage** - Games survive browser restarts
- **Complete Game State** - Saves board, timers, move history, and theme
- **Easy Management** - Save, load, or delete any slot

### 🎨 Beautiful Themes (6 Options)
- **🏛️ Classic** - Traditional brown/beige chess colors
- **🌊 Ocean Blue** - Cool blue and light gray
- **🌲 Forest Green** - Natural green and cream
- **👑 Royal Purple** - Elegant purple and pink
- **❤️ Crimson** - Bold red and pink
- **🪵 Dark Wood** - Rich brown wood tones

### 📝 Professional Features
- **Move History** - Complete game notation in standard chess format
- **Chess Coordinates** - a-h columns and 1-8 rows
- **Latest Move Highlighting** - Visual feedback for recent moves
- **Responsive Design** - Perfect on desktop, tablet, and mobile

### 🎵 Immersive Audio
- **Move Sounds** - Satisfying click for regular moves
- **Capture Effects** - Dramatic audio for piece captures
- **Game Start Fanfare** - Musical chord progression
- **Victory Celebration** - Triumphant victory fanfare
- **Timer Alerts** - Audio warnings for low time
- **Sound Toggle** - Mute/unmute option

### 🎬 Stunning Animations
- **Smooth Piece Movement** - Pieces glide between squares
- **Victory Celebration** - Confetti explosion and rainbow background
- **Interactive Feedback** - Hover effects and button animations
- **Visual Indicators** - Glowing valid moves and selected pieces
- **Timer Warnings** - Pulsing effects for low time

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mychessgame.git
   cd mychessgame
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to play the game!

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 🎮 How to Play

1. **Select Time Control** - Choose from Blitz (5min), Rapid (10min), or Classical (30min)
2. **Pick Your Theme** - Select from 6 beautiful board themes
3. **Start Playing** - Click any white piece to begin
4. **Make Moves** - Click a piece, then click where you want to move it
5. **Green dots** show valid moves for selected pieces
6. **Capture Pieces** - Click on opponent pieces to capture them
7. **Watch the Timer** - Don't let your time run out!
8. **Save Your Game** - Use the Save/Load feature to continue later

## 🛠️ Technologies Used

- **React** - Frontend framework
- **CSS3** - Styling and animations
- **Web Audio API** - Sound effects
- **Local Storage** - Game persistence
- **CSS Variables** - Dynamic theming

## 🎯 Game Rules

- **White moves first**
- **Pieces move according to standard chess rules**
- **Capture opponent's king to win**
- **Run out of time = lose**
- **Click pieces to select, click destination to move**

## 📱 Mobile Support

The game is fully responsive and works great on:
- 📱 Smartphones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

## 🎨 Customization

### Adding New Themes
1. Add theme colors to `boardThemes` object in `App.js`
2. Add corresponding CSS variables in `App.css`
3. Theme changes apply instantly!

### Modifying Sound Effects
1. Adjust frequencies and durations in sound functions
2. Add new sounds using the Web Audio API
3. Customize sound triggers for different actions

## 🏆 Features Comparison

| Feature | Our Chess Game | Chess.com | Lichess |
|---------|---------------|-----------|---------|
| Multiple Themes | ✅ 6 themes | ✅ | ✅ |
| Sound Effects | ✅ Built-in | ✅ | ✅ |
| Save/Load Games | ✅ 5 slots | ✅ | ✅ |
| Timer System | ✅ 3 modes | ✅ | ✅ |
| Move History | ✅ Complete | ✅ | ✅ |
| Animations | ✅ Advanced | ❌ | ✅ |
| No Registration | ✅ Free | ❌ | ✅ |

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chess piece Unicode symbols
- React community for excellent documentation
- CSS animations inspiration
- Web Audio API for sound generation

## 📞 Contact

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Email**: your.email@example.com

---

**⭐ If you enjoyed this chess game, please give it a star on GitHub!**

Built with ❤️ and React
