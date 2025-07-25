// DOM Elements
const adinkraToggle = document.getElementById('adinkra-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const emojiButton = document.querySelector('.emoji-button');
const emojiPicker = document.getElementById('emoji-picker');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const chatItems = document.querySelectorAll('.chat-item');
const notificationToast = document.getElementById('notification-toast');
const groupTitles = document.querySelectorAll('.group-title');
// Sound toggle removed

// State Management
let currentTheme = localStorage.getItem('theme') || 'light';
let currentChat = 'kwame';
let isTyping = false;
let typingTimeout;
let draftMessages = JSON.parse(localStorage.getItem('draftMessages')) || {};
let conversations = JSON.parse(localStorage.getItem('conversations')) || {
    kwame: [
        { sender: 'received', text: 'Hey Ama! How are you doing today?', time: '10:30 AM', reactions: [{emoji: '👍', count: 1}] },
        { sender: 'sent', text: 'I\'m good, thanks! Just finished my morning meeting.', time: '10:32 AM', reactions: [] },
        { sender: 'received', text: 'Great! Are you coming to the event tonight at Osu?', time: '10:33 AM', reactions: [] },
        { sender: 'received', text: 'It\'s going to be amazing! Everyone will be there.', time: '10:33 AM', reactions: [] },
        { sender: 'sent', text: 'I\'m not sure yet. What time does it start?', time: '10:40 AM', reactions: [{emoji: '🤔', count: 1}] },
        { sender: 'received', text: 'Around 8 PM. I can pick you up if you want!', time: '10:42 AM', reactions: [] },
        { sender: 'received', text: 'Are you coming to the event tonight?', time: '12:42 PM', reactions: [] }
    ],
    'the-boys': [
        { sender: 'received', text: 'Hey everyone!', time: '9:15 AM', reactions: [], user: 'Kofi' },
        { sender: 'received', text: 'Let\'s meet at Osu this weekend', time: '9:16 AM', reactions: [], user: 'Kofi' },
        { sender: 'received', text: 'Sounds good!', time: '9:20 AM', reactions: [], user: 'Kwesi' },
        { sender: 'sent', text: 'What time?', time: '9:25 AM', reactions: [] },
        { sender: 'received', text: 'How about 7 PM on Saturday?', time: '9:30 AM', reactions: [], user: 'Kofi' }
    ],
    'sister-szn': [
        { sender: 'received', text: 'Did you see the new fabric?', time: '2 days ago', reactions: [], user: 'Abena' },
        { sender: 'sent', text: 'Not yet, where did you find it?', time: '2 days ago', reactions: [] },
        { sender: 'received', text: 'At the Makola market, near the entrance', time: '2 days ago', reactions: [], user: 'Abena' },
        { sender: 'received', text: 'It\'s beautiful!', time: '2 days ago', reactions: [], user: 'Efua' }
    ],
    akosua: [
        { sender: 'received', text: 'Hi Ama, are you free this weekend?', time: '3 days ago', reactions: [] },
        { sender: 'sent', text: 'I might be. What do you have in mind?', time: '3 days ago', reactions: [] },
        { sender: 'received', text: 'Let\'s go shopping!', time: '3 days ago', reactions: [] },
        { sender: 'received', text: 'Let me know when you\'re free', time: '3 days ago', reactions: [] }
    ],
    family: [
        { sender: 'received', text: 'Don\'t forget Sunday dinner', time: '1 week ago', reactions: [], user: 'Mom' },
        { sender: 'sent', text: 'I\'ll be there!', time: '1 week ago', reactions: [] },
        { sender: 'received', text: 'Bring dessert if you can', time: '1 week ago', reactions: [], user: 'Dad' }
    ],
    work: [
        { sender: 'received', text: 'Meeting at 9am tomorrow', time: '1 week ago', reactions: [], user: 'Boss' },
        { sender: 'sent', text: 'I\'ll prepare the presentation', time: '1 week ago', reactions: [] },
        { sender: 'received', text: 'Great, thanks!', time: '1 week ago', reactions: [], user: 'Colleague' }
    ]
};

// Initialize the app
function init() {
    // Set theme from localStorage
    setTheme(currentTheme);
    
    // Load draft message if exists
    if (draftMessages[currentChat]) {
        messageInput.value = draftMessages[currentChat];
    }
    
    // Add event listeners
    addEventListeners();
    
    // Show notification after 5 seconds
    setTimeout(showNotification, 5000);
    
    // Simulate typing indicator
    simulateTyping();
    
    // Set Adinkra toggle color based on theme
    updateAdinkraToggle();
    
    // Sound toggle functionality removed
    
    // Initialize typing effects
    initTypingEffects();
}

// Event Listeners
function addEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Adinkra toggle - show a cultural fact or proverb
    if (adinkraToggle) {
        adinkraToggle.addEventListener('click', showGhanaianProverb);
    }
    
    // Sound toggle removed
    
    // Emoji picker toggle
    if (emojiButton) {
        emojiButton.addEventListener('click', toggleEmojiPicker);
    }
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        if (emojiButton && emojiPicker && !emojiButton.contains(e.target) && !emojiPicker.contains(e.target)) {
            emojiPicker.classList.remove('active');
        }
    });
    
    // Emoji selection
    const emojis = document.querySelectorAll('.emoji');
    emojis.forEach(emoji => {
        emoji.addEventListener('click', () => {
            insertEmoji(emoji.dataset.emoji);
            if (emojiPicker) {
                emojiPicker.classList.remove('active');
            }
        });
    });
    
    // Send message
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    if (messageInput) {
        // Send message on Enter key
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Save draft message
        messageInput.addEventListener('input', () => {
            draftMessages[currentChat] = messageInput.value;
            localStorage.setItem('draftMessages', JSON.stringify(draftMessages));
        });
    }
    
    // Chat item selection
    if (chatItems && chatItems.length > 0) {
        chatItems.forEach(item => {
            item.addEventListener('click', () => {
                // Save current draft
                if (messageInput) {
                    draftMessages[currentChat] = messageInput.value;
                }
                
                // Update active chat
                document.querySelector('.chat-item.active')?.classList.remove('active');
                item.classList.add('active');
                currentChat = item.dataset.chat;
                
                // Update chat header
                updateChatHeader(currentChat);
                
                // Load messages for this chat
                loadMessages(currentChat);
                
                // Load draft message if exists
                if (messageInput) {
                    messageInput.value = draftMessages[currentChat] || '';
                }
                
                // Save to localStorage
                localStorage.setItem('draftMessages', JSON.stringify(draftMessages));
            });
        });
    }
    
    // Add click listeners to message bubbles for reaction
    document.addEventListener('click', (e) => {
        const messageBubble = e.target.closest('.message-bubble');
        if (messageBubble) {
            const messageElement = messageBubble.closest('.message');
            if (messageElement) {
                const messageIndex = Array.from(messageElement.parentNode.children).indexOf(messageElement) - 1; // -1 for date divider
                
                // Only allow reactions on received messages
                if (messageElement.classList.contains('received')) {
                    addReaction(messageIndex, '👍');
                }
            }
        }
    });
    
    // Group title collapse/expand
    groupTitles.forEach(title => {
        title.addEventListener('click', () => {
            const group = title.closest('.chat-group');
            title.classList.toggle('collapsed');
            group.classList.toggle('collapsed');
        });
    });
}

// Theme Functions
function setTheme(theme) {
    if (document.body) {
        document.body.className = `${theme}-mode`;
    }
    
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
    
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    updateAdinkraToggle();
}

function updateAdinkraToggle() {
    if (!adinkraToggle) return;
    
    if (currentTheme === 'dark') {
        adinkraToggle.style.backgroundColor = '#f7b731'; // Kente gold
        const img = adinkraToggle.querySelector('img');
        if (img) img.style.filter = 'brightness(0) invert(1)';
    } else {
        adinkraToggle.style.backgroundColor = '#3867d6'; // Kente blue
        const img = adinkraToggle.querySelector('img');
        if (img) img.style.filter = 'brightness(0) invert(1)';
    }
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Emoji Functions
function toggleEmojiPicker() {
    if (!emojiPicker) return;
    emojiPicker.classList.toggle('active');
}

function insertEmoji(emoji) {
    if (!messageInput) return;
    
    messageInput.value += emoji;
    messageInput.focus();
    
    // Save draft
    draftMessages[currentChat] = messageInput.value;
    localStorage.setItem('draftMessages', JSON.stringify(draftMessages));
}

// Message Functions
function sendMessage() {
    if (!messageInput) return;
    
    const text = messageInput.value.trim();
    if (!text) return;
    
    // Get current time
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const time = `${hours}:${minutes} ${ampm}`;
    
    // Add message to conversations
    const newMessage = {
        sender: 'sent',
        text,
        time,
        reactions: []
    };
    
    conversations[currentChat].push(newMessage);
    localStorage.setItem('conversations', JSON.stringify(conversations));
    
    // Add message to UI
    addMessageToUI(newMessage);
    
    // Play sound
    if (soundManager) {
        soundManager.play('messageSent');
    }
    
    // Clear input and draft
    messageInput.value = '';
    draftMessages[currentChat] = '';
    localStorage.setItem('draftMessages', JSON.stringify(draftMessages));
    
    // Simulate reply after delay
    setTimeout(() => {
        simulateTyping();
    }, 1000);
    
    setTimeout(() => {
        const replyText = getRandomReply();
        const replyMessage = {
            sender: 'received',
            text: replyText,
            time,
            reactions: [],
            user: currentChat === 'kwame' ? undefined : getRandomUser(currentChat)
        };
        
        conversations[currentChat].push(replyMessage);
        localStorage.setItem('conversations', JSON.stringify(conversations));
        
        addMessageToUI(replyMessage);
        if (soundManager) {
            soundManager.play('messageReceived');
        }
        stopTyping();
    }, 3000);
}

function addMessageToUI(message) {
    if (!chatMessages || !message) return;
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', message.sender);
    
    let html = '';
    
    if (message.sender === 'received') {
        html += `
            <div class="avatar">
                <img src="${getAvatarForChat(currentChat, message.user)}" alt="Avatar">
            </div>
        `;
    }
    
    html += `
        <div class="message-content">
            <div class="message-bubble">
    `;
    
    if (message.user && message.sender === 'received') {
        html += `<span class="message-user">${message.user}</span>`;
    }
    
    html += `
                <p>${message.text || ''}</p>
                <span class="time">${message.time || ''}</span>
            </div>
            <div class="message-reactions">
    `;
    
    if (message.reactions && Array.isArray(message.reactions)) {
        message.reactions.forEach(reaction => {
            html += `<div class="reaction">${reaction.emoji} ${reaction.count}</div>`;
        });
    }
    
    html += `
            </div>
        </div>
    `;
    
    messageElement.innerHTML = html;
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function loadMessages(chatId) {
    if (!chatMessages) return;
    
    // Clear current messages
    while (chatMessages.children.length > 1) { // Keep the date divider
        chatMessages.removeChild(chatMessages.lastChild);
    }
    
    // Add messages from conversation
    const messages = conversations[chatId] || [];
    messages.forEach(message => {
        addMessageToUI(message);
    });
}

function updateChatHeader(chatId) {
    const chatHeader = document.querySelector('.chat-header .chat-user-info');
    if (!chatHeader) return;
    
    const chatItem = document.querySelector(`.chat-item[data-chat="${chatId}"]`);
    
    if (chatItem) {
        const nameElement = chatItem.querySelector('h4');
        const name = nameElement ? nameElement.textContent : 'Chat';
        const avatar = chatItem.querySelector('img')?.src || '';
        const isGroup = chatItem.querySelector('.group-avatar') !== null;
        
        let html = '';
        
        if (isGroup) {
            html = `
                <div class="avatar group-avatar">
                    <div class="stacked-avatars">
                        <img src="${chatItem.querySelectorAll('img')[0]?.src || ''}" alt="Group Member">
                        <img src="${chatItem.querySelectorAll('img')[1]?.src || ''}" alt="Group Member">
                    </div>
                </div>
                <div>
                    <h2>${name}</h2>
                    <p class="status-text">${getGroupMembersText(chatId)}</p>
                </div>
            `;
        } else {
            const statusClass = chatItem.querySelector('.status-indicator')?.classList.contains('online') ? 'online' : 'idle';
            html = `
                <div class="avatar">
                    <img src="${avatar}" alt="${name} Avatar">
                    <span class="status-indicator ${statusClass}"></span>
                </div>
                <div>
                    <h2>${name}</h2>
                    <p class="status-text">${statusClass === 'online' ? 'Online' : 'Idle'}</p>
                </div>
            `;
        }
        
        chatHeader.innerHTML = html;
    }
}

// Typing Indicator
function simulateTyping() {
    const statusText = document.querySelector('.chat-header .status-text');
    if (!statusText) return;
    
    const chatId = currentChat;
    
    // Only show typing for individual chats, not groups
    if (!document.querySelector(`.chat-item[data-chat="${chatId}"] .group-avatar`)) {
        isTyping = true;
        statusText.innerHTML = 'Online - typing<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
        
        // Clear any existing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
    }
}

function stopTyping() {
    const statusText = document.querySelector('.chat-header .status-text');
    if (!statusText) return;
    
    const chatId = currentChat;
    
    if (!document.querySelector(`.chat-item[data-chat="${chatId}"] .group-avatar`)) {
        isTyping = false;
        statusText.textContent = 'Online';
    }
}

// Notification
function showNotification() {
    if (!notificationToast) return;
    
    notificationToast.classList.add('active');
    if (soundManager) {
        soundManager.play('notification');
    }
    
    setTimeout(() => {
        notificationToast.classList.remove('active');
    }, 5000);
}

// Reaction
function addReaction(messageIndex, emoji) {
    const message = conversations[currentChat][messageIndex];
    
    // Check if reaction already exists
    const existingReaction = message.reactions.find(r => r.emoji === emoji);
    
    if (existingReaction) {
        existingReaction.count++;
    } else {
        message.reactions.push({ emoji, count: 1 });
    }
    
    // Save to localStorage
    localStorage.setItem('conversations', JSON.stringify(conversations));
    
    // Update UI
    loadMessages(currentChat);
}

// Helper Functions
function getAvatarForChat(chatId, user) {
    if (!chatId) return 'https://randomuser.me/api/portraits/lego/1.jpg';
    
    if (chatId === 'kwame') {
        return 'https://randomuser.me/api/portraits/men/32.jpg';
    } else if (chatId === 'akosua') {
        return 'https://randomuser.me/api/portraits/women/65.jpg';
    } else if (chatId === 'the-boys') {
        if (user === 'Kofi') {
            return 'https://randomuser.me/api/portraits/men/22.jpg';
        } else {
            return 'https://randomuser.me/api/portraits/men/23.jpg';
        }
    } else if (chatId === 'sister-szn') {
        if (user === 'Abena') {
            return 'https://randomuser.me/api/portraits/women/22.jpg';
        } else {
            return 'https://randomuser.me/api/portraits/women/23.jpg';
        }
    } else if (chatId === 'family') {
        if (user === 'Mom') {
            return 'https://randomuser.me/api/portraits/women/67.jpg';
        } else {
            return 'https://randomuser.me/api/portraits/men/67.jpg';
        }
    } else if (chatId === 'work') {
        if (user === 'Boss') {
            return 'https://randomuser.me/api/portraits/men/76.jpg';
        } else {
            return 'https://randomuser.me/api/portraits/women/76.jpg';
        }
    }
    
    return 'https://randomuser.me/api/portraits/lego/1.jpg';
}

function getGroupMembersText(chatId) {
    if (!chatId) return 'Group Members';
    
    if (chatId === 'the-boys') {
        return 'Kofi, Kwesi, You';
    } else if (chatId === 'sister-szn') {
        return 'Abena, Efua, You';
    } else if (chatId === 'family') {
        return 'Mom, Dad, You';
    } else if (chatId === 'work') {
        return 'Boss, Colleague, You';
    }
    
    return 'Group Members';
}

function getRandomReply() {
    const replies = [
        'Sounds good!',
        'What do you think?',
        'I agree with you.',
        'Let me think about it.',
        'That\'s interesting!',
        'Can we talk more about this later?',
        'I\'ll get back to you on that.',
        'Perfect!',
        'Thanks for letting me know.',
        'I appreciate your message.'
    ];
    
    return replies[Math.floor(Math.random() * replies.length)];
}

function getRandomUser(chatId) {
    if (chatId === 'the-boys') {
        return Math.random() > 0.5 ? 'Kofi' : 'Kwesi';
    } else if (chatId === 'sister-szn') {
        return Math.random() > 0.5 ? 'Abena' : 'Efua';
    } else if (chatId === 'family') {
        return Math.random() > 0.5 ? 'Mom' : 'Dad';
    } else if (chatId === 'work') {
        return Math.random() > 0.5 ? 'Boss' : 'Colleague';
    }
    
    return undefined;
}

// Ghanaian Proverb Toast
function showGhanaianProverb() {
    if (!document.body) return;
    
    const proverbs = [
        'Knowledge is like a garden; if it is not cultivated, it cannot be harvested.',
        'The ruin of a nation begins in the homes of its people.',
        'When a king has good counselors, his reign is peaceful.',
        'It is the calm and silent water that drowns a man.',
        'No matter how long the night, the day is sure to come.',
        'A family is like a forest, when you are outside it is dense, when you are inside you see that each tree has its place.',
        'If you want to go fast, go alone. If you want to go far, go together.',
        'The path is made by walking.',
        'When the rhythm of the drumbeat changes, the dance steps must adapt.',
        'Wisdom is not like money to be tied up and hidden.',
        'The one who asks questions doesn not lose his way.',
        'A child who has washed his hands clean can eat with elders.',
        'The lizard that jumped from the high iroko tree to the ground said he would praise himself if no one else did.',
        'When a fish becomes rotten it begins from the head.',
        'The river may be wide, but it can be crossed.',
        'The chameleon changes color to match the earth, the earth doesn not change to match the chameleon.',
        'When the roots of a tree begin to decay, it spreads death to the branches.',
        'The death of an elderly man is like a burning library.',
        'A bird that flies off the earth and lands on an anthill is still on the ground.',
        'The sun will shine on those who stand before it shines on those who kneel under them.'
    ];
    
    // Create a custom toast for the proverb
    const proverbToast = document.createElement('div');
    proverbToast.classList.add('proverb-toast');
    
    // Add Adinkra symbol and proverb text
    proverbToast.innerHTML = `
        <div class="proverb-icon">
            <img src="img/adinkra.svg" alt="Adinkra Symbol">
        </div>
        <div class="proverb-content">
            <h4>Ghanaian Wisdom</h4>
            <p>${proverbs[Math.floor(Math.random() * proverbs.length)]}</p>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(proverbToast);
    
    // Animate in
    setTimeout(() => {
        proverbToast.classList.add('active');
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        proverbToast.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(proverbToast);
        }, 300);
    }, 5000);
    
    // Rotate the Adinkra toggle
    if (adinkraToggle) {
        adinkraToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            adinkraToggle.style.transform = 'rotate(0)';
        }, 500);
    }
}

// Sound Functions removed

// Initialize typing effects for elements with typing-effect class
function initTypingEffects() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    if (!typingElements || typingElements.length === 0) return;
    
    typingElements.forEach(element => {
        if (!element) return;
        
        // Get the text content or data-text attribute
        const text = element.getAttribute('data-text') || element.textContent;
        if (!text) return;
        
        // Clear the element's text content
        element.textContent = '';
        
        // Set the data-text attribute if not already set
        if (!element.getAttribute('data-text')) {
            element.setAttribute('data-text', text);
        }
            
        // Create a function to type the text
        function typeText() {
            if (!element || !text) return;
            
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                    // After a delay, clear and start again
                    setTimeout(() => {
                        if (element) element.textContent = '';
                        setTimeout(typeText, 500);
                    }, 2000);
                }
            }, 100);
        }
        
        // Start typing after a random delay
        setTimeout(typeText, Math.random() * 1000);
    });
}

// Initialize the app
init();