# Kokonsa - Chat Interface Simulation

## 📱 Overview

Kokonsa is a chat interface simulation prototype with a Ghanaian-inspired design. The name "Kokonsa" comes from the Twi language, meaning "to chat" or "to gossip". This prototype simulates a real chat application with pre-filled conversations, typing animations, emoji reactions, and more.

## 🛠️ Core Features

### Simulated Chat Threads
- Pre-filled message history mimicking real conversations
- Messages organized by time, sender, and context
- Ability to "reply" to threads with fake typing animation

### Dynamic Typing Bubble
- "User is typing..." animation using CSS transitions
- Custom avatars and statuses (online, idle, etc.)

### Emoji & Reaction System
- Pop-up emoji tray on click
- Reaction bubbles that animate into place

### Message Effects & Transitions
- Smooth message fade-in and slide-in effects

## 🎨 Design Aesthetics

### Kokonsa Vibe
- Color themes inspired by Kente cloth colors
- Ghanaian social flavor in the interface

### Dark/Light Mode
- Toggle with a floating button
- Preferences stored using `localStorage`

### Responsive UI
- Fully scalable from mobile to desktop
- Sticky chat bubble layouts

## ⚙️ Extra Functional Flair

### Simulated Notifications
- Toast alerts with fading animation

### Collapsible Chat Groups
- Click-to-reveal nested conversations
- Group avatars and custom chat titles

### LocalStorage Persistence
- Save simulated conversations across sessions
- Message drafts persist before "sending"

## 🚀 How to Use

1. Open `index.html` in a web browser
2. Interact with the chat interface:
   - Click on different chats in the sidebar to switch conversations
   - Type a message and click the send button (or press Enter)
   - Click the emoji button to open the emoji picker
   - Click on received messages to add a reaction
   - Toggle between light and dark mode using the moon/sun icon

## 🧩 Project Structure

```
kokonsa-prototype/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # Styling and animations
├── js/
│   └── script.js       # Interactive functionality
└── README.md           # Project documentation
```

## 🔮 Future Enhancements

- Add sound effects for message delivery
- Implement language localization (English/Twi toggle)
- Add more Adinkra symbols and cultural elements
- Create more interactive animations
- Implement voice messages simulation

## 📝 Notes

This is a frontend prototype only, with no backend functionality. All data is stored locally in the browser using localStorage.