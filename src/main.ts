import { Game } from './core/Game';

// Main game entry point
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  
  if (!canvas) {
    console.error('Game canvas not found');
    return;
  }
  
  const game = new Game({
    canvas: canvas,
    width: 800,
    height: 600,
    audioEnabled: true
  });

  // Start the game
  game.start();

  // Handle window resize
  window.addEventListener('resize', () => {
    game.handleResize();
  });
  
  // Handle audio unlock for autoplay policies
  document.addEventListener('click', () => {
    // Audio will be unlocked by user interaction
  }, { once: true });
});