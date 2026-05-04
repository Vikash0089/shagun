import { useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function EventPopup({ onEventCreated, onClose }) {
    const [form, setForm] = useState({
        eventType: 'Tilak',
        personName: '',
        eventDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/entries/event', form);
            toast.success('Event created 🎉');
            onEventCreated(data);
            onClose(); // close popup
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Error');
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 
            bg-gradient-to-br from-red-900/80 via-pink-800/70 to-yellow-600/60 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Glow background effect */}
            <div className="absolute w-[400px] h-[400px] bg-pink-500 opacity-30 blur-3xl rounded-full animate-pulse"></div>

            {/* Card */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md p-8 rounded-2xl 
                bg-white/10 backdrop-blur-xl border border-yellow-400 
                shadow-2xl transition duration-500 animate-scaleIn"
            >

                {/* ❌ Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-white text-2xl font-bold 
                    hover:text-yellow-300 transition duration-300 hover:scale-125"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
                    Event Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Event Type */}
                    <select
                        value={form.eventType}
                        onChange={e => setForm({ ...form, eventType: e.target.value })}
                        className="w-full p-3 rounded-lg bg-white/20 text-white 
                        focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                        <option className="text-black" value="Tilak">Tilak</option>
                        <option className="text-black" value="Vivah">Vivah</option>
                    </select>

                    {/* Name */}
                    <input
                        type="text"
                        placeholder="Add Name"
                        value={form.personName}
                        onChange={e => setForm({ ...form, personName: e.target.value })}
                        required
                        className="w-full p-3 rounded-lg bg-white/20 text-white 
                        placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />

                    {/* Date */}
                    <input
                        type="date"
                        placeholder = "Add Event Date"
                        value={form.eventDate}
                        onChange={e => setForm({ ...form, eventDate: e.target.value })}
                        required
                        className="w-full p-3 rounded-lg bg-white/20 text-white 
                        focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 
                        text-white py-3 rounded-lg font-semibold transition duration-300 
                        shadow-lg hover:shadow-yellow-400/50"
                    >
                        Start
                    </button>
                </form>
            </div>
        </div>
    );
}
