import { useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';
import { FiX } from 'react-icons/fi';

export default function QRPaymentModal({ event, setEvent, onClose }) {

    const [form, setForm] = useState({
        upiId: event.qrPayment?.upiId || '',
        name: event.qrPayment?.name || ''
    });

    const [showQR, setShowQR] = useState(
        !!event.qrPayment?.upiId
    );

    // ✅ Show / Hide Form
    const [showForm, setShowForm] = useState(false);

    const saveQR = async (e) => {

        e.preventDefault();

        try {

            const { data } = await API.put(
                `/entries/qr/${event._id}`,
                form
            );

            setEvent(data.event);

            toast.success('QR Updated');

            setShowQR(true);

            // optional
            setShowForm(false);

        } catch (err) {

            toast.error('Failed');

            console.log(err);
        }
    };

    const upiLink =
        `upi://pay?pa=${form.upiId}&pn=${form.name}&cu=INR`;

    return (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3">

            <div className="bg-white rounded-2xl w-full max-w-md p-5 relative text-black shadow-2xl">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                    <FiX size={22} />
                </button>

                {/* Heading */}
                <h2 className="text-2xl font-bold text-center mb-5">
                    💳 QR Payment Setup
                </h2>

                {/* SHOW BUTTON */}
                <div className="mb-4">

                    <button
                        type="button"
                        onClick={() => setShowForm(!showForm)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold"
                    >
                        {showForm
                            ? 'Hide QR Setup'
                            : 'Show QR Setup'}
                    </button>

                </div>

                {/* FORM */}
                {showForm && (

                    <form onSubmit={saveQR} className="space-y-4">

                        {/* UPI */}
                        <input
                            type="text"
                            placeholder="Enter UPI ID"
                            value={form.upiId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    upiId: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-purple-500"
                            required
                        />

                        {/* NAME */}
                        <input
                            type="text"
                            placeholder="Enter UPI Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-purple-500"
                        />

                        {/* SAVE */}
                        <button
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white py-3 rounded-lg font-semibold transition"
                        >
                            Save QR
                        </button>

                    </form>

                )}

                {/* QR SHOW */}
                {showQR && (

                    <div className="mt-6 text-center">

                        <div className="flex justify-center">

                            <div className="bg-white p-3 rounded-xl shadow-lg">

                                <QRCodeCanvas
                                    value={upiLink}
                                    size={220}
                                />

                            </div>

                        </div>

                        {/* Details */}
                        <div className="mt-4 text-sm bg-gray-100 rounded-xl p-4">

                            <table className="w-full text-left">

                                <tbody>

                                    {form.name && (
                                        <tr>
                                            <td className="font-semibold py-1">
                                                Name
                                            </td>

                                            <td>
                                                {form.name}
                                            </td>
                                        </tr>
                                    )}

                                    <tr>
                                        <td className="font-semibold py-1">
                                            UPI ID
                                        </td>

                                        <td className="break-all">
                                            {form.upiId}
                                        </td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}
