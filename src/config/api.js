// API Helper untuk komunikasi dengan JSON Server
const API_URL = 'http://localhost:3001';

// Helper untuk fetch dengan error handling
const fetchAPI = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Users API
export const usersAPI = {
    getAll: () => fetchAPI('/users'),

    getByUsername: async (username) => {
        const users = await fetchAPI('/users');
        return users[username] || null;
    },

    create: async (username, userData) => {
        const users = await fetchAPI('/users');
        users[username] = userData;
        return fetchAPI('/users', {
            method: 'PUT',
            body: JSON.stringify(users),
        });
    },

    update: async (username, userData) => {
        const users = await fetchAPI('/users');
        users[username] = { ...users[username], ...userData };
        return fetchAPI('/users', {
            method: 'PUT',
            body: JSON.stringify(users),
        });
    },

    delete: async (username) => {
        const users = await fetchAPI('/users');
        delete users[username];
        return fetchAPI('/users', {
            method: 'PUT',
            body: JSON.stringify(users),
        });
    },
};

// Schedules API
export const schedulesAPI = {
    getByUser: async (username) => {
        const schedules = await fetchAPI('/schedules');
        return schedules[username] || [];
    },

    create: async (username, scheduleData) => {
        const schedules = await fetchAPI('/schedules');
        if (!schedules[username]) {
            schedules[username] = [];
        }
        const newSchedule = {
            id: Date.now().toString(),
            ...scheduleData,
            createdAt: new Date().toISOString(),
        };
        schedules[username].push(newSchedule);
        await fetchAPI('/schedules', {
            method: 'PUT',
            body: JSON.stringify(schedules),
        });
        return newSchedule;
    },

    update: async (username, scheduleId, scheduleData) => {
        const schedules = await fetchAPI('/schedules');
        const userSchedules = schedules[username] || [];
        const index = userSchedules.findIndex(s => s.id === scheduleId);
        if (index !== -1) {
            userSchedules[index] = { ...userSchedules[index], ...scheduleData };
            schedules[username] = userSchedules;
            await fetchAPI('/schedules', {
                method: 'PUT',
                body: JSON.stringify(schedules),
            });
        }
    },

    delete: async (username, scheduleId) => {
        const schedules = await fetchAPI('/schedules');
        const userSchedules = schedules[username] || [];
        schedules[username] = userSchedules.filter(s => s.id !== scheduleId);
        return fetchAPI('/schedules', {
            method: 'PUT',
            body: JSON.stringify(schedules),
        });
    },
};

// Chats API
export const chatsAPI = {
    getByUser: async (username) => {
        const chats = await fetchAPI('/chats');
        return chats[username] || [];
    },

    create: async (username, chatData) => {
        const chats = await fetchAPI('/chats');
        if (!chats[username]) {
            chats[username] = [];
        }
        const newChat = {
            id: Date.now().toString(),
            ...chatData,
            createdAt: new Date().toISOString(),
        };
        chats[username].push(newChat);
        await fetchAPI('/chats', {
            method: 'PUT',
            body: JSON.stringify(chats),
        });
        return newChat;
    },
};

export default {
    usersAPI,
    schedulesAPI,
    chatsAPI,
};
