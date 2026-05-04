import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import EventPopup from './EventPopup';
import EntryTable from './EntryTable';
import { FiLogOut, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
            return;
        }
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await API.get('/entries/my-events');
            setEvents(data);
        } catch (err) {
            toast.error(err +'Events not found');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleEventCreated = (newEvent) => {
        setEvents([newEvent, ...events]);
        setSelectedEvent(newEvent);
        setShowPopup(false);
    };

    const updateEventInList = (updatedEvent) => {
        setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
        setSelectedEvent(updatedEvent);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-xl 
            bg-gradient-to-r from-red-900 via-pink-700 to-yellow-500 animate-gradient">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen relative 
        bg-gradient-to-r from-red-900 via-pink-700 to-yellow-500 animate-gradient">

            {/* 🔥 Navbar */}
            <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 
            px-6 py-4 flex justify-between items-center text-white shadow-lg">
                <h1 className="text-2xl font-bold tracking-wide"> Shagun</h1>

                <div className="flex items-center gap-4">
                    <span className="text-white/90">🙏🙏, {user?.name}</span>

                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <FiLogOut /> Logout
                    </button>
                </div>
            </nav>

            {selectedEvent ? (
                <div className="p-6">
                    <button
                        onClick={() => setSelectedEvent(null)}
                        className="mb-6 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30"
                    >
                        ← Back to All Events
                    </button>

                    <EntryTable event={selectedEvent} setEvent={updateEventInList} />
                </div>
            ) : (
                <div className="p-6 max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-white">Your Events</h2>

                        <button
                            onClick={() => setShowPopup(true)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 
                            rounded-lg flex items-center gap-2 font-semibold shadow-lg"
                        >
                            <FiPlus /> New Event
                        </button>
                    </div>

                    {/* No Events */}
                    {events.length === 0 ? (
                        <div className="text-center py-20 bg-white/10 backdrop-blur-lg rounded-xl shadow text-white">
                            <p className="text-lg mb-4">No events yet. Start your first hisaab!</p>
                            <button
                                onClick={() => setShowPopup(true)}
                                className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg"
                            >
                                Create First Event
                            </button>
                        </div>
                    ) : (

                        /* 💍 Big Premium Cards */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map(event => (
                                <div
                                    key={event._id}
                                    onClick={() => setSelectedEvent(event)}
                                    className="relative p-8 rounded-2xl cursor-pointer transition duration-500 
                                    bg-gradient-to-br from-red-900 via-pink-800 to-yellow-600 
                                    text-white shadow-2xl hover:scale-105 hover:shadow-yellow-400/40"
                                >

                                    {/* Glass Layer */}
                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl"></div>

                                    {/* Content */}
                                    <div className="relative z-10">

                                        {/* Badge */}
                                        <span className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                                            {event.eventType}
                                        </span>

                                        {/* Title */}
                                        <h3 className="text-2xl font-bold mb-3">
                                             {event.personName}
                                        </h3>

                                        {/* Date */}
                                        <p className="text-lg text-yellow-200 mb-4">
                                            📅 {new Date(event.eventDate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex justify-between items-center pt-4 border-t border-white/30">

                                            <span className="text-lg">
                                                Entries:
                                                <span className="font-bold ml-1">
                                                    {event.entries.length}
                                                </span>
                                            </span>

                                            <span className="text-2xl font-bold text-yellow-300">
                                                ₹{event.entries.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Popup */}
            {showPopup && (
                <EventPopup
                    onEventCreated={handleEventCreated}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </div>
    );
}
