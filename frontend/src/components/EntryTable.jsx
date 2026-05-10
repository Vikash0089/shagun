import { useState, useMemo } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import QRPaymentModal from './QRPaymentModal';
import {
    FiEdit2,
    FiTrash2,
    FiDownload,
    FiSearch,
    FiCreditCard,
    FiPlus,
    FiX
} from 'react-icons/fi';
import { BiRupee } from 'react-icons/bi';

export default function EntryTable({ event, setEvent }) {
    const [form, setForm] = useState({ fullName: '', address: '', pincode: '', amount: '' });
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showQR, setShowQR] = useState(false);

    // 🔍 Filter
    const filteredEntries = useMemo(() => {
        return event.entries.filter(e =>
            e.fullName.toLowerCase().includes(search.toLowerCase()) ||
            e.address.toLowerCase().includes(search.toLowerCase()) ||
            e.pincode.includes(search)
        );
    }, [event.entries, search]);

    const totalAmount = event.entries.reduce((sum, e) => sum + e.amount, 0);

    // ➕ Add / Update
    const addOrUpdateEntry = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { data } = await API.put(`/entries/${event._id}/${editingId}`, {
                    ...form, amount: Number(form.amount)
                });
                setEvent(data.event);
                setEditingId(null);
                toast.success('Updated');
            } else {
                const { data } = await API.post('/entries/add', {
                    eventId: event._id,
                    ...form,
                    amount: Number(form.amount)
                });
                setEvent(data);
                toast.success('Added');
            }
            setForm({ fullName: '', address: '', pincode: '', amount: '' });
            setShowForm(false);
        } catch {
            toast.error('Error');
        }
    };

    const startEdit = (entry) => {
        setEditingId(entry._id);
        setForm(entry);
        setShowForm(true);
    };

    const deleteEntry = async (id) => {
        const { data } = await API.delete(`/entries/${event._id}/${id}`);
        setEvent(data.event);
        toast.success('Deleted');
    };

    const downloadCSV = () => {
        const headers = 'Name,Address,Pincode,Amount\n';
        const rows = event.entries.map(e =>
            `"${e.fullName}","${e.address}","${e.pincode}",${e.amount}`
        ).join('\n');

        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'entries.csv';
        a.click();
    };

    const rowsToShow = [...filteredEntries];
    while (rowsToShow.length < 5) {
        rowsToShow.push(null);
    }

    return (
        <div className="min-h-screen p-4 text-white 
        bg-gradient-to-r from-red-900 via-pink-700 to-yellow-500 animate-gradient">

            <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 
                text-white tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                <span className="text-yellow-300">SHUBH</span>{" "}
                {event.eventType.toUpperCase()} - {event.personName}
            </h1>

            {/* 🔝 Top Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">

                {/* Left: Add + Search */}
                <div className="flex gap-2 w-full md:w-auto">

                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1 bg-yellow-500 px-3 py-1 rounded text-sm"
                    >
                        <FiPlus /> Add
                    </button>

                    <div className="flex items-center bg-white/20 px-2 rounded">
                        <FiSearch />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search"
                            className="bg-transparent outline-none px-2 py-1 text-sm placeholder-white"
                        />
                    </div>
                </div>

                {/* Right: Summary + CSV */}
                <div className="flex items-center gap-3 text-sm">
                    <span>
                        Entries: {event.entries.length}
                    </span>
                    <span className="flex items-center gap-1 font-bold">
                        <BiRupee /> {totalAmount}
                    </span>

                    <button
                        onClick={downloadCSV}
                        className="flex items-center gap-1 bg-green-500 px-3 py-1 rounded"
                    >
                        <FiDownload /> CSV
                    </button>
                    <button
                        onClick={() => setShowQR(true)}
                        className="flex items-center gap-1 bg-purple-600 px-3 py-1 rounded"
                    >
                        <FiCreditCard /> QR
                    </button>
                </div>
            </div>

            {/* ➕ Form */}
            {showForm && (
                <form onSubmit={addOrUpdateEntry}
                    className="bg-white/10 p-3 rounded mb-4 flex flex-wrap gap-2">

                    <input placeholder="Name"
                        value={form.fullName}
                        onChange={e => setForm({ ...form, fullName: e.target.value })}
                        className="p-1 rounded bg-white/20 text-sm" required />

                    <input placeholder="Address"
                        value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                        className="p-1 rounded bg-white/20 text-sm" required />

                    <input placeholder="Pincode"
                        value={form.pincode}
                        onChange={e => setForm({ ...form, pincode: e.target.value })}
                        className="p-1 rounded bg-white/20 text-sm" />

                    <input type="number" placeholder="Amount"
                        value={form.amount}
                        onChange={e => setForm({ ...form, amount: e.target.value })}
                        className="p-1 rounded bg-white/20 text-sm" required />

                    <button className="bg-yellow-500 px-3 rounded text-sm">
                        {editingId ? 'Update' : 'Save'}
                    </button>

                    <FiX onClick={() => setShowForm(false)} className="cursor-pointer" />
                </form>
            )}

            {/* 📊 Table */}
            <div className="overflow-x-auto bg-white/10 rounded">
                <table className="w-full text-sm">

                    <thead className="bg-white/20">
                        <tr>
                            <th className="py-2 px-2 text-left">Name</th>
                            <th className="py-2 px-2 text-left">Address</th>
                            <th className="py-2 px-2 text-center">Amount</th>
                            <th className="py-2 px-2 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rowsToShow.map((entry, i) => (
                            <tr key={i} className="border-t border-white/20 text-center">

                                {entry ? (
                                    <>
                                        <td className="py-2 px-2 text-left">{entry.fullName}</td>
                                        <td className="py-2 px-2 text-left">
                                            {entry.address}, {entry.pincode}
                                        </td>

                                        <td className="py-2 px-2 text-yellow-300 font-bold">
                                            ₹ {entry.amount}
                                        </td>

                                        <td className="py-2 px-2">
                                            <div className="flex justify-center gap-2">
                                                <FiEdit2 onClick={() => startEdit(entry)} className="cursor-pointer text-blue-400" />
                                                {/* <FiTrash2 onClick={() => deleteEntry(entry._id)} className="cursor-pointer text-red-400" /> */}
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <td colSpan="4" className="py-2 opacity-30">-</td>
                                )}

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
            {showQR && (
                <QRPaymentModal
                    event={event}
                    setEvent={setEvent}
                    onClose={() => setShowQR(false)}
                />
            )}
        </div>
    );
}
