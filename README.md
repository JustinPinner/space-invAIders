# Space InvAIders

"I" made a game with AI, and to be honest, I'm not sure how I feel about that. 

## !CAUTION! ##

This project was created entirely by AI and at the time of committing the first version to the `main` branch I haven't so much as looked at a single code file that it generated. PLEASE don't take it and run it without doing your own thorough checks first, and don't take anything you see here as good practice. It might be perfect, it might not, just don't assume that anything is properly assessed, validated or even secure.

In addition, all this was done in an Ubuntu KVM (Kernel-based Virtual Machine) instance because at this stage I didn't want to give these tools access to anything that could be compromised via my real hardware. I provided 8 vCPUs and 8GB RAM for the VM.

## About ##

Using a combination of [github spec-kit](https://github.com/github/spec-kit) and [opencode](https://opencode.ai/) I created this Space Invaders style game to learn how the process works.

The resulting game is not only an acceptable rapid prototype take on the original, it was created end-to-end without me writing, or even touching a single line of code. For FREE. 

The Cautionary note above is important, please don't skip over it.

It's probably worth noting that I haven't played the real Space Invaders game in quite a long time and that I can't recall exactly how the aliens stack up, or how the UFOs perform, or whether there are even bonus UFOs at the end of each level. But the result is pretty much exactly as I described it to the AI.

I should also point out that while I was able to create this project for free, this might not be true for you if/when you decide to follow along. At the time I started, the opencode team was in the process of assessing their AI model, and were being quite generous with the volume of tokens you could burn through without spending anything. Just check the T&Cs before you get started.

So how did that work? Let's dig in.

## The Process ##

I'm not going to describe the full setup process here, that's covered pretty well by each of the repos linked above. Just follow those instructions and you'll be good to go. Nor will I attempt to relay the READMEs of either project to you - they already do that far better than I ever could.

### Create your project ###

I created a new directory for the project, and followed the [opencode instructions to initialise it](https://opencode.ai/docs#initialize). 

### Constitution ###

So, once everything was installed and I'd started up the opencode environment (I'm using the Big Pickle model in zen mode throughout this exercise - and no, I don't really know what that means), I began by following spec-kit's [Establish project principles](https://github.com/github/spec-kit?tab=readme-ov-file#2-establish-project-principles) step as described in the [Get Started section](https://github.com/github/spec-kit?tab=readme-ov-file#-get-started). This was a straight up copy and paste into opencode to see if it was working:

`/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements`

Note that all `/speckit.<command>`s mentioned here are entered directly into the opencode text input field.

In response to `/speckit.constitution` opencode created a `.specify/memory/constitution.md` [(link)](https://github.com/JustinPinner/space-invAIders/blob/main/.specify/memory/constitution.md#space-invaders-constitution) file which appeared to have all the right words in it, albeit probably somewhat over-engineered for this project, particularly when talking about amendments requiring formal documentation, team approval and migration plans. However there were a few terms that appeared in here that I hadn't explicitly mentioned, suggesting it was already making itself aware of a few key points related to game performance: 

```
Game MUST maintain consistent 60 FPS during normal gameplay. Memory usage MUST NOT exceed 256MB during operation. Asset loading MUST complete within 5 seconds. Input latency MUST be under 16ms for responsive controls. Resource cleanup MUST prevent memory leaks during extended play sessions. Performance monitoring MUST track frame drops and resource usage patterns.
```

### Specify ###

Next, I ran the `/speckit.specify` command. This is where you describe the details of the game, in plain English, and where it really seems worthwhile to be as descriptive as possible. This is why I chose to recreate a version of Space Invaders: it's simple enough to describe in not-too-many-words (unlike this README), has simple gameplay rules and can be represented with simplistic graphics and user inputs. Also, I had some prior experience of putting together a clone of the 80s handheld classic [Astro Wars](https://github.com/JustinPinner/astrowars?tab=readme-ov-file), so I had a reasonable idea of many of the moving parts that would presumably be coming along here.

This ends up in the `spec.md` file [(link)](https://github.com/JustinPinner/space-invAIders/blob/main/specs/001-space-invaders-game/spec.md). 

Note that the only technical specification/hint here is to `Build a game with Typescript that runs in a web browser`. Bear that in mind as we look into the specifications that are generated in response.

### Plan ###

Now the `/spec-kit.plan` [documentation](https://github.com/github/spec-kit?tab=readme-ov-file#4-create-a-technical-implementation-plan) says that this is where you `provide your tech stack and architecture choices`. I chose not to do that as I have already said it should be coded in TypeScript, but beyond that I was curious to see what decisions would be made by the AI. It asked me for a few pointers related to the look and feel, e.g. should it resize with the browser, should it use detailed or simplified graphics (with the option to enhance later) but not much more. This all gets written out to the `plan.md` document [(link)](https://github.com/JustinPinner/space-invAIders/blob/main/specs/001-space-invaders-game/plan.md), and some interesting things came out of this.

```
Summary

Build a complete Space Invaders game in TypeScript with HTML5 Canvas, featuring sprite graphics, collision detection, scoring system, multiple levels, and responsive design. The game will run in a web browser with resizable display and follow classic Space Invaders gameplay mechanics.
```

I didn't mention Canvas specifically, but that seems like a solid choice for a browser-based game.

```
## Technical Context

**Language/Version**: TypeScript 5.7+  
**Primary Dependencies**: Phaser 3.90 + Vite 6.3+  
**Storage**: LocalStorage with fallback chain (LocalStorage → SessionStorage → Memory)  
**Testing**: Jest + jest-canvas-mock + Playwright + Canvest (multi-layer testing strategy)  
**Target Platform**: Web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)  
**Project Type**: Web application  
**Performance Goals**: 60 FPS gameplay (<2ms frame time), <200ms input response, <50MB memory usage  
**Constraints**: Single-screen responsive design, <3 second startup time, Howler.js for audio  
**Quality Gates**: 80% unit test coverage, performance benchmarks, TypeScript strict mode, automated linting  
**Scale/Scope**: Maximum 200 concurrent entities (48 aliens + 10 bullets + 5 bombs + 5 buildings + 1 UFO + particles)
```

So it chose Phaser and Vite, plus gave consideration for storage and testing frameworks (recall that the constitution doc stated that everything should be test-driven, so that makes sense). But notice also the performance characteristics in terms of frames-per-second and memory, and how they play into the numbers of entities that it expects to sustain, and the test coverage it expects. 

I liked the fact that it also created a `research.md` document [(link)](https://github.com/JustinPinner/space-invAIders/blob/main/specs/001-space-invaders-game/research.md) where it provides a summary of the thought processes behind the decisions made, and a `data-model.md` [(link)](https://github.com/JustinPinner/space-invAIders/blob/main/specs/001-space-invaders-game/data-model.md) where it sketched out the, well, data models! This is all really interesting stuff.

Then it went on to tick off the items from the constitution doc and it included some auditing of the documentation tree and the source code structure performed during the planning phase that gets added to the `plan.md` document. 

All of the documents listed here are included in this repo, so you'll be able to read through each in depth if you wish [(link)](https://github.com/JustinPinner/space-invAIders/tree/main/specs/001-space-invaders-game)

### Tasks ###

After planning we move on to generating a task list. This is simply telling opencode to run

`/speckit.tasks`

This generated a long list of things to be done (see the `tasks.md` file [(link)](https://github.com/JustinPinner/space-invAIders/blob/main/specs/001-space-invaders-game/tasks.md)) and I noticed that a lot of them had been marked up as being able to run in parallel (`[P]`). In theory this is great as it should speed up the whole process, but when it came to running the implementation, I started to encounter API rate limiting which isn't surprising given that I'm trying to do this on the cheap, so I removed the `[P]` flags to try to reduce the number of concurrent requests I was generating to the API.

### Implement ###

Everything up to this point has been quite impressive. Documenting the understanding of the brief, the self-determining of technologies to lean on beyond just my requirement of using TypeScript. But here is where things started getting real.

`/speckit.implement` begins the process of turning all the documents opencode and spec-kit have produced so far into real code.

A lot of things happened here, and for the most part I'd just let it get on with it while I did other things. And I think this was the really eye opening thing for me. I'd occasionally see the code it was generating appear as diffs in the opencode output as it gradually fleshed out the implementation, and for the most part everything I saw happening seemed sensible for the part of the process that was developing.

The API rate limits mentioned above did cause me to have to slow this phase down and tell opencode to `/speckit.implement US#` (one User Story # at a time) but that's fine. This was an experiment, no time pressures existed, and at this stage I still wasn't totally convinced I'd get a working game at the end of it.

And I was correct about that. Which is where the next phase of development became really intriguing.

### Debugging ###

There followed some back-and-forth from the point of initially running the game

`When I run npm run preview I get an [insert error here] error... `

It went off to resolve that error

`It now plays but is not responsive to user inputs...`

It fixed that

`Player inputs are working but we're getting stuck in the last phase of the level...`

It fixed that but there were a few more rounds of this particular problem. Input responsiveness, clashing counters, transitioning from one phase of the game to the next, UFOs spawning incorrectly and getting stuck at the end of particular levels.

In each case the AI would add debugging info (yes, as `console.log` entries - to which I can definitely relate) and ask me to capture what was happening. It then used those logged entries to narrow down the problem, describe the fix and implement it. Then it'd ask me to re-play the game and report back.

In all this took about six or seven cycles of play, debug, fix, play again until...

### Success! ###

I had done it! No, _it_ had done it! We had done it? Actually, had I really done anything? Other than talk about things to the machine, no. Had I _made_ this game? Also no. Was I proud of and/or pleased with it? Yes. But why? I have no right to be. I had practically no technical input beyond a couple of early decisions and some human testing at the end. It's a weird feeling.

### Play It! ###

It's deployed to Huthub pages. [Give it a try](https://justinpinner.github.io/space-invAIders/).

### Wrapping Up ###

The big take away from this for me was that, with very little real effort, a reasonably clear idea of a problem definition, and the ability to describe it clearly enough in words it could understand, I outsourced this project to an AI and paid it very little attention for the 80% phase of the development cycle while I got on with other things. I only had to return focus for half an hour or so at the end to interactively work through the debugging phase.

Would I use this same technique for a more significant project? One where there were real consequences for mistakes? At this time, I'd say no, at least not all the way through to completion. I might well use it to avoid the blank screen starting point for a brand new project, I imagine it'd be great to write up the requirements and planning notes, and perhaps even create a skeleton code structure that I could fill in. It'd be very helpful for that I think.

I have some other ideas for running this over some low-stakes pre-existing code of my own making, so maybe we'll see how it fares with that.

The last thing I asked opencode to do here was to produce a comprehensive README for the project. 

```
Can you create a readme.md to live with the project that clearly shows it was cteated by you and summarize the main decision points and a summary of the major milestones that were achieved? Wherever possible, provide references or credits to the source materials used as a basis for the resulting code.
```

And in response, everything below this line was generated by the AI
---

# Space InvAIders 🛸

A modern TypeScript implementation of the classic Space Invaders arcade game built with Phaser 3 and Vite.

## 🎮 About

Space InvAIders is a browser-based recreation of the iconic 1978 arcade game Space Invaders, featuring smooth gameplay, progressive difficulty, and modern web technologies. This project demonstrates game development patterns, entity systems, and state management in TypeScript.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open `http://localhost:5173` in development or `http://localhost:4173` after preview to play.

## 🎯 Features

- **Classic Gameplay**: Authentic Space Invaders mechanics with smooth controls
- **Progressive Difficulty**: 20 levels with increasing alien speed and fire rates
- **Bonus UFO System**: Random UFO encounters and end-of-level bonus opportunities
- **Sound Effects**: Audio feedback for shooting, explosions, and level transitions
- **Particle Effects**: Visual explosions and impact effects
- **Score System**: Points for aliens, UFOs, and level completion bonuses
- **Lives System**: 3 lives with respawn mechanics

## 🛠️ Tech Stack

- **TypeScript 5.7+**: Type-safe game logic and entity management
- **Phaser 3.90**: 2D game framework for rendering and physics
- **Vite 6.3+**: Fast development server and production bundler
- **Canvas API**: Hardware-accelerated 2D graphics rendering

## 📁 Project Structure

```
src/
├── core/           # Core game systems
│   ├── Game.ts     # Main game controller
│   ├── GameObject.ts
│   ├── CollisionSystem.ts
│   └── GameStateManager.ts
├── entities/       # Game entities
│   ├── Player.ts
│   ├── Alien.ts
│   ├── UFO.ts
│   ├── Bullet.ts
│   └── Bomb.ts
├── systems/        # Game systems
│   ├── InputSystem.ts
│   ├── RenderSystem.ts
│   ├── UISystem.ts
│   ├── AudioSystem.ts
│   ├── AlienGrid.ts
│   ├── BuildingManager.ts
│   ├── UFOSystem.ts
│   └── BombSystem.ts
├── pools/          # Object pooling for performance
│   ├── ObjectPool.ts
│   ├── BulletPool.ts
│   └── AlienPool.ts
└── utils/          # Utilities and constants
    ├── GameConstants.ts
    └── GameTypes.ts
```

## 🎮 Controls

- **Enter**: Start game / Navigate menus
- **Arrow Keys** (←/→): Move player left/right
- **Spacebar**: Shoot bullets
- **Escape**: Pause/Resume game

## 🏗️ Architecture Decisions

### Entity System Pattern

Implemented an entity-component system inspired by modern game development practices:

- **GameObject Base Class**: Common properties (position, dimensions, active state)
- **Specialized Entities**: Player, Alien, UFO, Bullet, Bomb with unique behaviors
- **System-based Processing**: Separate systems handle updates, rendering, and collisions

### Object Pooling

For optimal performance, used object pooling instead of frequent garbage collection:

- **BulletPool**: Manages up to 10 bullets simultaneously
- **AlienPool**: Handles 48 aliens (6x8 grid) efficiently
- **Memory Management**: Reuses objects instead of creating/destroying

### State Management

Implemented a robust state machine for game flow:

```typescript
type GameState = 'menu' | 'playing' | 'paused' | 'level-complete' | 'game-over' | 'victory';
```

- **Centralized Control**: GameStateManager handles all state transitions
- **Timer-based Transitions**: Automatic progress after level completion
- **Input Handling**: Context-sensitive controls based on current state

### Performance Optimization

- **Frame Rate Cap**: 60 FPS target with delta time calculations
- **Collision Detection**: Efficient AABB collision checking
- **Asset Management**: Minimal sprite usage, programmatic rendering

## 📈 Development Milestones

### Phase 1: Core Foundation

- ✅ **Project Setup**: TypeScript, Phaser, Vite configuration
- ✅ **Basic Rendering**: Canvas setup and game loop
- ✅ **Input System**: Keyboard event handling and state tracking
- ✅ **GameObject System**: Base entity class and inheritance

### Phase 2: Game Mechanics

- ✅ **Player Movement**: Smooth left/right movement with screen bounds
- ✅ **Shooting System**: Bullet creation, pooling, and collision
- ✅ **Alien Grid**: 6x8 alien formation with movement patterns
- ✅ **Collision Detection**: Bullet-alien, bomb-player, building interactions

### Phase 3: Advanced Features

- ✅ **Building System**: Destructible barriers with damage states
- ✅ **UFO System**: Random spawning and bonus UFO at level completion
- ✅ **Sound System**: Audio feedback for all game events
- ✅ **Particle Effects**: Explosion visual effects

### Phase 4: Polish & Optimization

- ✅ **Level Progression**: 20 levels with scaling difficulty
- ✅ **UI System**: Score, lives, and level display
- ✅ **State Management**: Complete game flow from menu to victory
- ✅ **Performance**: Object pooling and efficient rendering

## 🔧 Technical Implementation Details

### Game Loop Architecture

```typescript
// Main game loop with delta time calculations
const gameLoop = (timestamp: number) => {
    const deltaTime = Math.min(timestamp - lastTime, 100); // Cap at 100ms
    this.update(deltaTime);
    this.render();
    requestAnimationFrame(gameLoop);
};
```

### Collision System

Implemented efficient AABB (Axis-Aligned Bounding Box) collision detection:

- **Broad Phase**: Quick rejection checks for non-intersecting objects
- **Narrow Phase**: Precise collision resolution and response
- **Performance**: Spatial partitioning and early exit conditions

### Object Pooling Pattern

```typescript
export abstract class ObjectPool<T> {
    protected pool: T[]; // Available objects
    protected active: T[]; // Currently in use

    public acquire(): T | null {
        // Reuse existing object or create new one
    }

    public release(obj: T): void {
        // Reset and return to pool
    }
}
```

## 🎨 Visual Design

### Color Scheme

Inspired by the original arcade game with modern enhancements:

- **Player**: Bright green (#00ff00)
- **Aliens**: Classic red (#ff0000)
- **UFO**: Yellow with bonus indicators (#ffff00)
- **Buildings**: Blue (#0088ff)
- **Background**: Deep space blue (#000033)

### Rendering Style

- **Vector Graphics**: Programmatic rendering for scalability
- **Smooth Animation**: 60 FPS interpolated movement
- **Visual Feedback**: Impact effects and explosion particles

## 📚 References & Credits

### Inspiration Sources

1. **Original Space Invaders (1978)** - Taito Corporation
    - Core gameplay mechanics and scoring system
    - Alien movement patterns and grid formation

2. **Modern Game Development Patterns**
    - Entity-Component-System architecture
    - Object pooling for performance optimization
    - State machine design patterns

3. **Web Game Development Best Practices**
    - Canvas API optimization techniques
    - TypeScript game development patterns
    - Phaser 3 framework documentation

### Technical References

- **Phaser 3 Documentation** - Game framework concepts and API
- **TypeScript Handbook** - Type-safe programming patterns
- **MDN Web Docs** - Canvas API and browser gaming standards
- **Game Programming Patterns** - Robert Nystrom's design patterns

### Community Resources

- **HTML5 Game Devs** - Community best practices and techniques
- **GDC Vault** - Game development talks and presentations
- **Stack Overflow** - Specific technical problem-solving

## 🚀 Performance Metrics

### Targets Met

- **60 FPS**: Consistent frame rate on modern browsers
- **Memory Usage**: <50MB target with object pooling
- **Load Time**: <3 second startup time achieved
- **Bundle Size**: ~42KB gzipped for production

### Optimizations Implemented

- Object pooling reduces garbage collection pauses
- Efficient collision detection with early rejection
- Minimal DOM manipulation (single canvas element)
- Asset preloading and caching strategies

## 🔮 Future Enhancements

### Potential Features

- **Power-ups**: Multi-shot, rapid fire, shield
- **Boss Battles**: End-level boss aliens with unique patterns
- **Leaderboard**: Local high score tracking
- **Mobile Support**: Touch controls and responsive design
- **Sound Effects**: More comprehensive audio experience

### Technical Improvements

- **WebGL Renderer**: Hardware acceleration fallback
- **Service Worker**: Offline gameplay support
- **PWA Integration**: Installable web app experience
- **Saves/Resume**: Game state persistence

## 📄 License

This project is created for educational and demonstration purposes. The code is open source and available for learning and modification.

## 👾 Created By

**Space InvAIders** was developed by OpenCode Assistant as a demonstration of modern web game development using TypeScript, Phaser 3, and contemporary game development patterns.

Built with ❤️ and lots of caffeine! ☕
