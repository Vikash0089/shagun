import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [particles, setParticles] = useState([]);
    const navigate = useNavigate();

    // 🎉 Confetti
    useEffect(() => {
        const temp = Array.from({ length: 35 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 5 + Math.random() * 5,
            color: ["#facc15", "#f87171", "#fb7185", "#fde047"][Math.floor(Math.random() * 4)],
        }));
        setParticles(temp);
    }, []);

    // 🖱️ 3D Tilt
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientY - rect.top) / rect.height - 0.5;
        const y = (e.clientX - rect.left) / rect.width - 0.5;

        setTilt({
            x: x * 15,
            y: y * -15
        });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    // 📝 Register
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/register', form);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            toast.success('Account ban gaya 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Register failed');
        }
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center 
            bg-gradient-to-r from-red-900 via-pink-700 to-yellow-500 animate-gradient"
            style={{ perspective: "1000px" }}
        >

            {/* 🎉 Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute w-2 h-2 rounded-sm opacity-80"
                        style={{
                            left: `${p.left}%`,
                            backgroundColor: p.color,
                            animation: `fall ${p.duration}s linear infinite`,
                            animationDelay: `${p.delay}s`
                        }}
                    />
                ))}
            </div>

            {/* 💳 Card */}
            <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl 
                shadow-2xl w-full max-w-md border border-yellow-400 transition duration-300"
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                }}
            >

                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    💍 Shagun-Hisab Register
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full p-3 rounded-lg bg-white/20 text-white 
                        placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full p-3 rounded-lg bg-white/20 text-white 
                        placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                        className="w-full p-3 rounded-lg bg-white/20 text-white 
                        placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 
                        text-white py-3 rounded-lg font-semibold transition duration-300 
                        shadow-lg hover:shadow-yellow-500/50"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center mt-4 text-white">
                    Already have account?{" "}
                    <Link to="/" className="text-yellow-300 font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}