import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  // Chess piece Unicode symbols
  const pieces = {
    // White pieces
    'white-king': '♔',
    'white-queen': '♕',
    'white-rook': '♖',
    'white-bishop': '♗',
    'white-knight': '♘',
    'white-pawn': '♙',
    // Black pieces
    'black-king': '♚',
    'black-queen': '♛',
    'black-rook': '♜',
    'black-bishop': '♝',
    'black-knight': '♞',
    'black-pawn': '♟'
  };

  // Board themes
  const boardThemes = {
    classic: {
      name: 'Classic',
      light: '#f0d9b5',
      dark: '#b58863',
      border: '#8b4513',
      frame: '#8b4513'
    },
    blue: {
      name: 'Ocean Blue',
      light: '#dee3e6',
      dark: '#4a90a4',
      border: '#2c5f70',
      frame: '#1e4552'
    },
    green: {
      name: 'Forest Green',
      light: '#eeeed2',
      dark: '#769656',
      border: '#4a5c3a',
      frame: '#3d4a2e'
    },
    purple: {
      name: 'Royal Purple',
      light: '#f3e5f5',
      dark: '#8e4ec6',
      border: '#6a1b9a',
      frame: '#4a148c'
    },
    red: {
      name: 'Crimson',
      light: '#fce4ec',
      dark: '#c2185b',
      border: '#880e4f',
      frame: '#560027'
    },
    wood: {
      name: 'Dark Wood',
      light: '#f5deb3',
      dark: '#8b4513',
      border: '#654321',
      frame: '#3e2723'
    }
  };

  // Sound effects using Web Audio API
  const audioContext = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize audio context
  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  // Sound generation functions
  const playSound = (frequency, duration, type = 'sine', volume = 0.1) => {
    if (!soundEnabled || !audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration);
  };

  const playMoveSound = () => {
    playSound(800, 0.1, 'square', 0.05);
  };

  const playCaptureSound = () => {
    // Two-tone capture sound
    playSound(600, 0.1, 'sawtooth', 0.08);
    setTimeout(() => playSound(400, 0.15, 'triangle', 0.06), 50);
  };

  const playGameStartSound = () => {
    playSound(523, 0.2, 'sine', 0.05); // C note
    setTimeout(() => playSound(659, 0.2, 'sine', 0.05), 200); // E note
    setTimeout(() => playSound(784, 0.3, 'sine', 0.05), 400); // G note
  };

  const playWinSound = () => {
    // Victory fanfare
    const notes = [523, 659, 784, 1047]; // C, E, G, C
    notes.forEach((note, index) => {
      setTimeout(() => playSound(note, 0.3, 'sine', 0.08), index * 150);
    });
  };

  const playButtonSound = () => {
    playSound(1000, 0.05, 'square', 0.03);
  };

  const playTimerSound = () => {
    playSound(1200, 0.05, 'sine', 0.02);
  };

  // Initial chess board setup
  const getInitialPiece = (row, col) => {
    // Black pieces (top of board)
    if (row === 0) {
      if (col === 0 || col === 7) return 'black-rook';
      if (col === 1 || col === 6) return 'black-knight';
      if (col === 2 || col === 5) return 'black-bishop';
      if (col === 3) return 'black-queen';
      if (col === 4) return 'black-king';
    }
    if (row === 1) return 'black-pawn';
    
    // White pieces (bottom of board)
    if (row === 6) return 'white-pawn';
    if (row === 7) {
      if (col === 0 || col === 7) return 'white-rook';
      if (col === 1 || col === 6) return 'white-knight';
      if (col === 2 || col === 5) return 'white-bishop';
      if (col === 3) return 'white-queen';
      if (col === 4) return 'white-king';
    }
    
    return null; // Empty square
  };

  // Create initial board
  const createInitialBoard = () => {
    const board = [];
    for (let row = 0; row < 8; row++) {
      const currentRow = [];
      for (let col = 0; col < 8; col++) {
        currentRow.push({
          row,
          col,
          piece: getInitialPiece(row, col)
        });
      }
      board.push(currentRow);
    }
    return board;
  };

  // Time control options (in seconds)
  const timeControls = {
    blitz: 300,     // 5 minutes
    rapid: 600,     // 10 minutes
    classical: 1800 // 30 minutes
  };

  // Load saved theme from localStorage
  const loadSavedTheme = () => {
    const saved = localStorage.getItem('chessTheme');
    return saved && boardThemes[saved] ? saved : 'classic';
  };

  // Load sound setting from localStorage
  const loadSoundSetting = () => {
    const saved = localStorage.getItem('chessSoundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  };

  // Game state
  const [board, setBoard] = useState(createInitialBoard());
  const [currentTurn, setCurrentTurn] = useState('white');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState('');
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveNumber, setMoveNumber] = useState(1);
  const [boardTheme, setBoardTheme] = useState(loadSavedTheme());
  const [animatingPiece, setAnimatingPiece] = useState(null);
  const [celebrationEffect, setCelebrationEffect] = useState(false);
  
  // Timer state
  const [timeControl, setTimeControl] = useState('blitz');
  const [whiteTime, setWhiteTime] = useState(timeControls.blitz);
  const [blackTime, setBlackTime] = useState(timeControls.blitz);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Save/Load state
  const [saveSlots, setSaveSlots] = useState([]);
  const [showSaveLoad, setShowSaveLoad] = useState(false);

  // Animation and sound state
  const [soundEnabledState, setSoundEnabledState] = useState(loadSoundSetting());

  // Update sound enabled state and save to localStorage
  useEffect(() => {
    setSoundEnabled(soundEnabledState);
    localStorage.setItem('chessSoundEnabled', JSON.stringify(soundEnabledState));
  }, [soundEnabledState]);

  // Load saved games on component mount
  useEffect(() => {
    loadSaveSlots();
    initAudio();
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('chessTheme', boardTheme);
    // Apply theme CSS variables
    const theme = boardThemes[boardTheme];
    const root = document.documentElement;
    root.style.setProperty('--board-light', theme.light);
    root.style.setProperty('--board-dark', theme.dark);
    root.style.setProperty('--board-border', theme.border);
    root.style.setProperty('--board-frame', theme.frame);
  }, [boardTheme]);

  // Timer effect with sound
  useEffect(() => {
    let interval;
    
    if (timerActive && gameStarted && !gameStatus) {
      interval = setInterval(() => {
        if (currentTurn === 'white') {
          setWhiteTime(prev => {
            if (prev <= 11 && prev > 1) {
              playTimerSound();
            }
            if (prev <= 1) {
              setGameStatus('Black wins on time!');
              setTimerActive(false);
              setTimeout(() => {
                playWinSound();
                setCelebrationEffect(true);
                setTimeout(() => setCelebrationEffect(false), 3000);
              }, 500);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setBlackTime(prev => {
            if (prev <= 11 && prev > 1) {
              playTimerSound();
            }
            if (prev <= 1) {
              setGameStatus('White wins on time!');
              setTimerActive(false);
              setTimeout(() => {
                playWinSound();
                setCelebrationEffect(true);
                setTimeout(() => setCelebrationEffect(false), 3000);
              }, 500);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, currentTurn, gameStarted, gameStatus]);

  // Save/Load functionality
  const loadSaveSlots = () => {
    const saves = [];
    for (let i = 1; i <= 5; i++) {
      const saved = localStorage.getItem(`chessSave${i}`);
      if (saved) {
        try {
          const gameData = JSON.parse(saved);
          saves.push({
            slot: i,
            data: gameData,
            timestamp: new Date(gameData.timestamp).toLocaleString()
          });
        } catch (e) {
          saves.push({ slot: i, data: null, timestamp: null });
        }
      } else {
        saves.push({ slot: i, data: null, timestamp: null });
      }
    }
    setSaveSlots(saves);
  };

  const saveGame = (slot) => {
    const gameData = {
      board,
      currentTurn,
      moveHistory,
      moveNumber,
      timeControl,
      whiteTime,
      blackTime,
      gameStarted,
      timerActive,
      gameStatus,
      boardTheme,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`chessSave${slot}`, JSON.stringify(gameData));
    loadSaveSlots();
    setShowSaveLoad(false);
    playButtonSound();
    alert(`Game saved to slot ${slot}!`);
  };

  const loadGame = (slot) => {
    const saved = localStorage.getItem(`chessSave${slot}`);
    if (saved) {
      try {
        const gameData = JSON.parse(saved);
        
        setBoard(gameData.board);
        setCurrentTurn(gameData.currentTurn);
        setMoveHistory(gameData.moveHistory);
        setMoveNumber(gameData.moveNumber);
        setTimeControl(gameData.timeControl);
        setWhiteTime(gameData.whiteTime);
        setBlackTime(gameData.blackTime);
        setGameStarted(gameData.gameStarted);
        setTimerActive(gameData.timerActive);
        setGameStatus(gameData.gameStatus || '');
        setBoardTheme(gameData.boardTheme || 'classic');
        
        setSelectedSquare(null);
        setValidMoves([]);
        setShowSaveLoad(false);
        
        playButtonSound();
        alert(`Game loaded from slot ${slot}!`);
      } catch (e) {
        alert('Error loading game!');
      }
    }
  };

  const deleteSave = (slot) => {
    if (window.confirm(`Delete save slot ${slot}?`)) {
      localStorage.removeItem(`chessSave${slot}`);
      loadSaveSlots();
      playButtonSound();
    }
  };

  // Helper functions
  const isValidPosition = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const getPieceColor = (piece) => {
    if (!piece) return null;
    return piece.startsWith('white') ? 'white' : 'black';
  };

  const getPieceType = (piece) => {
    if (!piece) return null;
    return piece.split('-')[1];
  };

  // Convert position to chess notation
  const positionToNotation = (row, col) => {
    const file = String.fromCharCode(97 + col); // a-h
    const rank = 8 - row; // 8-1
    return file + rank;
  };

  // Get piece symbol for notation
  const getPieceSymbol = (piece) => {
    if (!piece) return '';
    const type = getPieceType(piece);
    switch (type) {
      case 'king': return 'K';
      case 'queen': return 'Q';
      case 'rook': return 'R';
      case 'bishop': return 'B';
      case 'knight': return 'N';
      case 'pawn': return '';
      default: return '';
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Move validation functions for each piece type
  const isValidPawnMove = (fromRow, fromCol, toRow, toCol, piece, board) => {
    const color = getPieceColor(piece);
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    // Forward move
    if (colDiff === 0) {
      if (rowDiff === direction && !board[toRow][toCol].piece) return true;
      if (fromRow === startRow && rowDiff === 2 * direction && !board[toRow][toCol].piece) return true;
    }
    // Diagonal capture
    else if (colDiff === 1 && rowDiff === direction) {
      return board[toRow][toCol].piece && getPieceColor(board[toRow][toCol].piece) !== color;
    }
    return false;
  };

  const isValidRookMove = (fromRow, fromCol, toRow, toCol, board) => {
    if (fromRow !== toRow && fromCol !== toCol) return false;
    
    const rowStep = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
    const colStep = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol].piece) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    return true;
  };

  const isValidBishopMove = (fromRow, fromCol, toRow, toCol, board) => {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    if (rowDiff !== colDiff) return false;
    
    const rowStep = toRow > fromRow ? 1 : -1;
    const colStep = toCol > fromCol ? 1 : -1;
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow) {
      if (board[currentRow][currentCol].piece) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    return true;
  };

  const isValidKnightMove = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  };

  const isValidQueenMove = (fromRow, fromCol, toRow, toCol, board) => {
    return isValidRookMove(fromRow, fromCol, toRow, toCol, board) || 
           isValidBishopMove(fromRow, fromCol, toRow, toCol, board);
  };

  const isValidKingMove = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return rowDiff <= 1 && colDiff <= 1;
  };

  // Main move validation
  const isValidMove = (fromRow, fromCol, toRow, toCol, board) => {
    if (!isValidPosition(toRow, toCol)) return false;
    
    const piece = board[fromRow][fromCol].piece;
    const targetPiece = board[toRow][toCol].piece;
    
    if (!piece) return false;
    if (targetPiece && getPieceColor(piece) === getPieceColor(targetPiece)) return false;
    
    const pieceType = getPieceType(piece);
    
    switch (pieceType) {
      case 'pawn':
        return isValidPawnMove(fromRow, fromCol, toRow, toCol, piece, board);
      case 'rook':
        return isValidRookMove(fromRow, fromCol, toRow, toCol, board);
      case 'bishop':
        return isValidBishopMove(fromRow, fromCol, toRow, toCol, board);
      case 'knight':
        return isValidKnightMove(fromRow, fromCol, toRow, toCol);
      case 'queen':
        return isValidQueenMove(fromRow, fromCol, toRow, toCol, board);
      case 'king':
        return isValidKingMove(fromRow, fromCol, toRow, toCol);
      default:
        return false;
    }
  };

  // Get all valid moves for a piece
  const getValidMovesForPiece = (row, col, board) => {
    const moves = [];
    for (let toRow = 0; toRow < 8; toRow++) {
      for (let toCol = 0; toCol < 8; toCol++) {
        if (isValidMove(row, col, toRow, toCol, board)) {
          moves.push({ row: toRow, col: toCol });
        }
      }
    }
    return moves;
  };

  // Handle square click
  const handleSquareClick = (row, col) => {
    initAudio(); // Initialize audio on first user interaction
    
    if (!gameStarted) {
      setGameStarted(true);
      setTimerActive(true);
      playGameStartSound();
    }

    const clickedSquare = board[row][col];
    
    // If no piece is selected
    if (!selectedSquare) {
      if (clickedSquare.piece && getPieceColor(clickedSquare.piece) === currentTurn) {
        setSelectedSquare({ row, col });
        setValidMoves(getValidMovesForPiece(row, col, board));
        playButtonSound();
      }
      return;
    }

    // If clicking the same square, deselect
    if (selectedSquare.row === row && selectedSquare.col === col) {
      setSelectedSquare(null);
      setValidMoves([]);
      playButtonSound();
      return;
    }

    // If clicking another piece of the same color, select it
    if (clickedSquare.piece && getPieceColor(clickedSquare.piece) === currentTurn) {
      setSelectedSquare({ row, col });
      setValidMoves(getValidMovesForPiece(row, col, board));
      playButtonSound();
      return;
    }

    // Try to move the selected piece
    if (isValidMove(selectedSquare.row, selectedSquare.col, row, col, board)) {
      makeMove(selectedSquare.row, selectedSquare.col, row, col);
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
      playButtonSound();
    }
  };

  // Make a move with animation
  const makeMove = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = board.map(row => row.map(square => ({ ...square })));
    const piece = newBoard[fromRow][fromCol].piece;
    const capturedPiece = newBoard[toRow][toCol].piece;

    // Set up animation
    setAnimatingPiece({
      piece,
      fromRow,
      fromCol,
      toRow,
      toCol
    });

    // Play appropriate sound
    if (capturedPiece) {
      playCaptureSound();
    } else {
      playMoveSound();
    }

    // Animate piece movement
    setTimeout(() => {
      // Create move notation
      const pieceSymbol = getPieceSymbol(piece);
      const fromNotation = positionToNotation(fromRow, fromCol);
      const toNotation = positionToNotation(toRow, toCol);
      const captureSymbol = capturedPiece ? 'x' : '';
      const moveNotation = `${pieceSymbol}${fromNotation}${captureSymbol}${toNotation}`;

      // Add to move history
      const newMove = {
        number: currentTurn === 'white' ? moveNumber : moveNumber,
        white: currentTurn === 'white' ? moveNotation : null,
        black: currentTurn === 'black' ? moveNotation : null,
        piece,
        from: fromNotation,
        to: toNotation,
        captured: capturedPiece,
        time: currentTurn === 'white' ? whiteTime : blackTime
      };

      setMoveHistory(prev => {
        if (currentTurn === 'white') {
          return [...prev, newMove];
        } else {
          // Update the last move to include black's move
          const updatedHistory = [...prev];
          if (updatedHistory.length > 0) {
            updatedHistory[updatedHistory.length - 1].black = moveNotation;
          }
          return updatedHistory;
        }
      });

      // Move the piece
      newBoard[toRow][toCol].piece = piece;
      newBoard[fromRow][fromCol].piece = null;

      // Update game state
      setBoard(newBoard);
      setSelectedSquare(null);
      setValidMoves([]);
      setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
      setAnimatingPiece(null);
      
      if (currentTurn === 'black') {
        setMoveNumber(prev => prev + 1);
      }

      // Check for game ending conditions
      if (capturedPiece) {
        const capturedType = getPieceType(capturedPiece);
        if (capturedType === 'king') {
          setGameStatus(`${currentTurn === 'white' ? 'White' : 'Black'} wins!`);
          setTimerActive(false);
          setTimeout(() => {
            playWinSound();
            setCelebrationEffect(true);
            setTimeout(() => setCelebrationEffect(false), 3000);
          }, 500);
        }
      }
    }, 300); // Animation duration
  };

  // Check if square is selected
  const isSelected = (row, col) => {
    return selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
  };

  // Check if square is a valid move
  const isValidMoveSquare = (row, col) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  // Function to determine if a square should be dark or light
  const isLightSquare = (row, col) => {
    return (row + col) % 2 === 0;
  };

  // Get column letters (a-h)
  const getColumnLabel = (col) => {
    return String.fromCharCode(97 + col); // 'a' + col
  };

  // Get row numbers (8-1, since chess board is numbered from bottom)
  const getRowLabel = (row) => {
    return 8 - row;
  };

  // Reset game
  const resetGame = () => {
    setBoard(createInitialBoard());
    setCurrentTurn('white');
    setSelectedSquare(null);
    setValidMoves([]);
    setGameStatus('');
    setMoveHistory([]);
    setMoveNumber(1);
    setWhiteTime(timeControls[timeControl]);
    setBlackTime(timeControls[timeControl]);
    setGameStarted(false);
    setTimerActive(false);
    setAnimatingPiece(null);
    setCelebrationEffect(false);
    playButtonSound();
  };

  // Change time control
  const handleTimeControlChange = (newTimeControl) => {
    if (!gameStarted) {
      setTimeControl(newTimeControl);
      setWhiteTime(timeControls[newTimeControl]);
      setBlackTime(timeControls[newTimeControl]);
      playButtonSound();
    }
  };

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabledState(!soundEnabledState);
    playButtonSound();
  };

  return (
    <div className={`App ${celebrationEffect ? 'celebration' : ''}`}>
      <h1>My Chess Game</h1>
      
      {/* Game controls */}
      <div className="game-controls">
        <div className="control-section">
          <div className="time-controls">
            <label>Time Control:</label>
            {Object.keys(timeControls).map(control => (
              <button
                key={control}
                className={`time-control-btn ${timeControl === control ? 'active' : ''}`}
                onClick={() => handleTimeControlChange(control)}
                disabled={gameStarted}
              >
                {control === 'blitz' ? '5 min' : control === 'rapid' ? '10 min' : '30 min'}
              </button>
            ))}
          </div>
          
          <div className="theme-controls">
            <label>Board Theme:</label>
            <select 
              value={boardTheme} 
              onChange={(e) => {
                setBoardTheme(e.target.value);
                playButtonSound();
              }}
              className="theme-selector"
            >
              {Object.entries(boardThemes).map(([key, theme]) => (
                <option key={key} value={key}>{theme.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="control-section">
          <button className="control-btn" onClick={resetGame}>
            🔄 New Game
          </button>
          <button className="control-btn" onClick={() => {
            setShowSaveLoad(!showSaveLoad);
            playButtonSound();
          }}>
            💾 Save/Load
          </button>
          <button className="control-btn sound-btn" onClick={toggleSound}>
            {soundEnabledState ? '🔊' : '🔇'} Sound
          </button>
        </div>
      </div>

      {/* Save/Load Modal */}
      {showSaveLoad && (
        <div className="modal-overlay" onClick={() => setShowSaveLoad(false)}>
          <div className="save-load-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Save/Load Game</h3>
            <div className="save-slots">
              {saveSlots.map(slot => (
                <div key={slot.slot} className="save-slot">
                  <div className="slot-info">
                    <strong>Slot {slot.slot}</strong>
                    {slot.data ? (
                      <div className="slot-details">
                        <div>Saved: {slot.timestamp}</div>
                        <div>Turn: {slot.data.currentTurn}</div>
                        <div>Moves: {slot.data.moveHistory?.length || 0}</div>
                      </div>
                    ) : (
                      <div className="slot-empty">Empty</div>
                    )}
                  </div>
                  <div className="slot-actions">
                    <button onClick={() => saveGame(slot.slot)} className="save-btn">
                      💾 Save
                    </button>
                    {slot.data && (
                      <>
                        <button onClick={() => loadGame(slot.slot)} className="load-btn">
                          📁 Load
                        </button>
                        <button onClick={() => deleteSave(slot.slot)} className="delete-btn">
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="close-modal" onClick={() => setShowSaveLoad(false)}>
              ✖️ Close
            </button>
          </div>
        </div>
      )}

      {/* Game status and timers */}
      <div className="game-info">
        <div className="timers">
          <div className={`timer ${currentTurn === 'black' ? 'active' : ''} ${blackTime <= 10 ? 'low-time' : ''}`}>
            <div className="timer-label">Black</div>
            <div className="timer-display">{formatTime(blackTime)}</div>
          </div>
          <div className="current-turn">
            Current Turn: <span className={`turn-indicator ${currentTurn}`}>
              {currentTurn === 'white' ? 'White' : 'Black'}
            </span>
          </div>
          <div className={`timer ${currentTurn === 'white' ? 'active' : ''} ${whiteTime <= 10 ? 'low-time' : ''}`}>
            <div className="timer-label">White</div>
            <div className="timer-display">{formatTime(whiteTime)}</div>
          </div>
        </div>
        {gameStatus && <div className="game-status">{gameStatus}</div>}
      </div>

      <div className="main-game-area">
        {/* Chess board */}
        <div className="chess-container">
          <div className={`board-with-coordinates theme-${boardTheme}`}>
            {/* Top column labels */}
            <div className="top-labels">
              <div className="corner"></div>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(col => (
                <div key={col} className="column-label">
                  {getColumnLabel(col)}
                </div>
              ))}
              <div className="corner"></div>
            </div>

            {/* Chess board with row labels */}
            <div className="board-row-container">
              <div className="row-labels-left">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(row => (
                  <div key={row} className="row-label">
                    {getRowLabel(row)}
                  </div>
                ))}
              </div>

              <div className="chess-board">
                {board.map((row, rowIndex) => (
                  <div key={rowIndex} className="board-row">
                    {row.map((square, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`square ${
                          isLightSquare(rowIndex, colIndex) ? 'light' : 'dark'
                        } ${isSelected(rowIndex, colIndex) ? 'selected' : ''} ${
                          isValidMoveSquare(rowIndex, colIndex) ? 'valid-move' : ''
                        } ${animatingPiece && animatingPiece.fromRow === rowIndex && animatingPiece.fromCol === colIndex ? 'animating-from' : ''} ${
                          animatingPiece && animatingPiece.toRow === rowIndex && animatingPiece.toCol === colIndex ? 'animating-to' : ''
                        }`}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                      >
                        {square.piece && !(animatingPiece && animatingPiece.fromRow === rowIndex && animatingPiece.fromCol === colIndex) && (
                          <span className="chess-piece">
                            {pieces[square.piece]}
                          </span>
                        )}
                        {isValidMoveSquare(rowIndex, colIndex) && (
                          <div className="move-indicator"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                
                {/* Animating piece */}
                {animatingPiece && (
                  <div className="animating-piece">
                    <span className="chess-piece">
                      {pieces[animatingPiece.piece]}
                    </span>
                  </div>
                )}
              </div>

              <div className="row-labels-right">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(row => (
                  <div key={row} className="row-label">
                    {getRowLabel(row)}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom column labels */}
            <div className="bottom-labels">
              <div className="corner"></div>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(col => (
                <div key={col} className="column-label">
                  {getColumnLabel(col)}
                </div>
              ))}
              <div className="corner"></div>
            </div>
          </div>
        </div>

        {/* Move history */}
        <div className="move-history">
          <h3>Move History</h3>
          <div className="history-scroll">
            {moveHistory.length === 0 ? (
              <div className="no-moves">No moves yet</div>
            ) : (
              <table className="moves-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>White</th>
                    <th>Black</th>
                  </tr>
                </thead>
                <tbody>
                  {moveHistory.map((move, index) => (
                    <tr key={index} className={index === moveHistory.length - 1 ? 'latest-move' : ''}>
                      <td>{move.number}</td>
                      <td>{move.white || ''}</td>
                      <td>{move.black || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      
      {/* Celebration particles */}
      {celebrationEffect && (
        <div className="celebration-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`}>🎉</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
