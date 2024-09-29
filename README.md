# Chad's game

## Installation

### Prerequisites

- Cocos creator 3.8.0.
- VS code.

### Steps

1. **Change Scene** Select lobby scene from the dropdown.
2. **Play** Click Play Button.

## Add New Level

## Gameplay

### Controls

- **Touch/Mouse:**

  - Rotate: Click

### Objectives

completing levels.

### Support

For further assistance, please contact our support team at [chandankrishnani99@gmail.com].

## Coding Practices

### Initial Scene: Lobby

Responsible for:

- Logo animation
- Resource loading
- Persistnode integration
- UI creation
- Level selection interface

### Persistnode

- Integrated to ensure that attached components, such as the music/sound manager, continue to function across scenes.

### Localization Support

- Integrated Cocos extension i18n.
- Supported languages: English, French, Portuguese.

### Multi-Resolution Support

- Utilizes the `ScreenAdapter.ts` class for multi-resolution handling.
- Attached to the canvas.
- Adjusts resolution based on screen ratio to fit height or width on resize.
- Widget is used, it can automatically align the current node to any position in the parent node's bounding box, or constrain the size, making game easily adaptable to different resolutions.

### Gameplay

- Creates a map (roadTypeKeyPair) of road segment prefabs to avoid iteration.
- Loads levels and checks if a level is already loaded. If not in cache, loads it from resources.
- Creates levels and updates properties of each road segment.
- Checks game progress by comparing the resultant angle of each segment with the current angle.
- Loads the next level upon completion; if it is the last level, reloads the first level.

## Credits

List the team members and their roles:
