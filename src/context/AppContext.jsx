import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SAVED_PLANTS, INITIAL_REMINDERS, INITIAL_COMMUNITY_POSTS } from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Theme state
    const [theme, setTheme] = useState(() => localStorage.getItem('plantai_theme') || 'light');

    // Gemini API Key state
    const [geminiApiKey, setGeminiApiKey] = useState(() => {
        return localStorage.getItem('plantai_gemini_key') || (import.meta.env.VITE_GEMINI_API_KEY || '');
    });

    // User Profile
    const [userProfile, setUserProfile] = useState(() => {
        const saved = localStorage.getItem('plantai_user_profile');
        return saved ? JSON.parse(saved) : {
            name: 'Alex Rivera',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            experience: 'intermediate',
            interests: ['indoor', 'tropical', 'succulents'],
            metricUnits: true,
            pushNotifications: true,
            hasCompletedOnboarding: false
        };
    });

    // Saved Plants
    const [savedPlants, setSavedPlants] = useState(() => {
        const saved = localStorage.getItem('plantai_saved_plants');
        return saved ? JSON.parse(saved) : INITIAL_SAVED_PLANTS;
    });

    // Care Reminders
    const [reminders, setReminders] = useState(() => {
        const saved = localStorage.getItem('plantai_reminders');
        return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    });

    // Community Posts
    const [communityPosts, setCommunityPosts] = useState(() => {
        const saved = localStorage.getItem('plantai_community');
        return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
    });

    // Active Chat Context Plant
    const [activeChatContext, setActiveChatContext] = useState(null);

    // Chat Messages History
    const [chatMessages, setChatMessages] = useState(() => {
        const saved = localStorage.getItem('plantai_chat_history');
        return saved ? JSON.parse(saved) : [
            {
                id: 'msg-1',
                sender: 'assistant',
                text: 'Hello Alex! 🌿 I am your PlantAI Botanist assistant. How can I help your green family today?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                quickReplies: ['Rose plant care tips', 'How is my Monstera?', 'Watering tips'],
                embeddedCard: null
            }
        ];
    });

    // Toast Notification state
    const [toastNotification, setToastNotification] = useState(null);

    const showToast = (message, type = 'info') => {
        setToastNotification({ id: Date.now(), message, type });
        setTimeout(() => {
            setToastNotification(null);
        }, 3500);
    };

    // Synchronize to localStorage
    useEffect(() => {
        localStorage.setItem('plantai_theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('plantai_gemini_key', geminiApiKey);
    }, [geminiApiKey]);

    useEffect(() => {
        localStorage.setItem('plantai_user_profile', JSON.stringify(userProfile));
    }, [userProfile]);

    useEffect(() => {
        localStorage.setItem('plantai_saved_plants', JSON.stringify(savedPlants));
    }, [savedPlants]);

    useEffect(() => {
        localStorage.setItem('plantai_reminders', JSON.stringify(reminders));
    }, [reminders]);

    useEffect(() => {
        localStorage.setItem('plantai_community', JSON.stringify(communityPosts));
    }, [communityPosts]);

    useEffect(() => {
        localStorage.setItem('plantai_chat_history', JSON.stringify(chatMessages));
    }, [chatMessages]);

    // Actions
    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const saveGeminiApiKey = (key) => {
        setGeminiApiKey(key.trim());
        showToast(key.trim() ? 'Gemini API Key updated!' : 'Gemini API Key removed.', key.trim() ? 'success' : 'info');
    };

    const updateUserProfile = (updates) => {
        setUserProfile(prev => ({ ...prev, ...updates }));
        showToast('Profile updated successfully!', 'success');
    };

    const addPlant = (newPlantData) => {
        const newPlant = {
            id: 'plant-' + Date.now(),
            acquiredDate: new Date().toISOString().split('T')[0],
            healthStatus: 'healthy',
            healthScore: 95,
            lastCheckDate: new Date().toISOString().split('T')[0],
            lastWatered: new Date().toISOString().split('T')[0],
            waterIntervalDays: 7,
            lastFertilized: new Date().toISOString().split('T')[0],
            fertilizeIntervalDays: 30,
            photoHistory: [
                {
                    date: new Date().toISOString().split('T')[0],
                    url: newPlantData.thumbnail || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
                    note: 'Added to plant collection.'
                }
            ],
            ...newPlantData
        };

        setSavedPlants(prev => [newPlant, ...prev]);
        showToast(`Added ${newPlant.nickname || newPlant.speciesName} to My Plants!`, 'success');
        return newPlant;
    };

    const updatePlant = (plantId, updates) => {
        setSavedPlants(prev => prev.map(p => p.id === plantId ? { ...p, ...updates } : p));
        showToast('Plant details updated!', 'info');
    };

    const deletePlant = (plantId) => {
        setSavedPlants(prev => prev.filter(p => p.id !== plantId));
        setReminders(prev => prev.filter(r => r.plantId !== plantId));
        showToast('Plant removed from collection.', 'info');
    };

    const addPhotoToPlant = (plantId, photoUrl, noteText) => {
        setSavedPlants(prev => prev.map(plant => {
            if (plant.id === plantId) {
                const newPhoto = {
                    date: new Date().toISOString().split('T')[0],
                    url: photoUrl,
                    note: noteText || 'Updated plant photo'
                };
                return {
                    ...plant,
                    thumbnail: photoUrl,
                    lastCheckDate: new Date().toISOString().split('T')[0],
                    photoHistory: [newPhoto, ...plant.photoHistory]
                };
            }
            return plant;
        }));
        showToast('New photo logged to plant timeline!', 'success');
    };

    const toggleReminderComplete = (reminderId) => {
        setReminders(prev => prev.map(rem => {
            if (rem.id === reminderId) {
                const newCompleted = !rem.completed;
                if (newCompleted && rem.type.toLowerCase().includes('water')) {
                    // update lastWatered on corresponding plant
                    setSavedPlants(sp => sp.map(p => p.id === rem.plantId ? { ...p, lastWatered: new Date().toISOString().split('T')[0] } : p));
                }
                return { ...rem, completed: newCompleted };
            }
            return rem;
        }));
        showToast('Reminder status updated!', 'success');
    };

    const snoozeReminder = (reminderId, days = 2) => {
        setReminders(prev => prev.map(rem => {
            if (rem.id === reminderId) {
                const current = new Date(rem.dueDate);
                current.setDate(current.getDate() + days);
                const newDueDate = current.toISOString().split('T')[0];
                return { ...rem, dueDate: newDueDate, snoozedUntil: newDueDate };
            }
            return rem;
        }));
        showToast(`Snoozed task by ${days} days.`, 'info');
    };

    const addReminder = (reminderData) => {
        const newRem = {
            id: 'rem-' + Date.now(),
            completed: false,
            snoozedUntil: null,
            ...reminderData
        };
        setReminders(prev => [newRem, ...prev]);
        showToast('New care reminder scheduled!', 'success');
    };

    const addChatMessage = (messageObj) => {
        setChatMessages(prev => [...prev, messageObj]);
    };

    const toggleLikePost = (postId) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const likedByMe = !post.likedByMe;
                return {
                    ...post,
                    likedByMe,
                    likes: likedByMe ? post.likes + 1 : post.likes - 1
                };
            }
            return post;
        }));
    };

    const addCommentToPost = (postId, text) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const newComment = {
                    id: 'c-' + Date.now(),
                    author: userProfile.name,
                    text
                };
                return {
                    ...post,
                    commentsCount: post.commentsCount + 1,
                    comments: [...post.comments, newComment]
                };
            }
            return post;
        }));
        showToast('Comment posted to community feed!', 'success');
    };

    return (
        <AppContext.Provider value={{
            theme,
            toggleTheme,
            geminiApiKey,
            saveGeminiApiKey,
            userProfile,
            updateUserProfile,
            savedPlants,
            addPlant,
            updatePlant,
            deletePlant,
            addPhotoToPlant,
            reminders,
            toggleReminderComplete,
            snoozeReminder,
            addReminder,
            activeChatContext,
            setActiveChatContext,
            chatMessages,
            addChatMessage,
            communityPosts,
            toggleLikePost,
            addCommentToPost,
            toastNotification,
            showToast
        }}>
            {children}
        </AppContext.Provider>
    );
};

export { useApp } from './useApp';
