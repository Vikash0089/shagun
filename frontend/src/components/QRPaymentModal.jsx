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

        } catch (err) {
            toast.error('Failed');
        }
    };

    const upiLink =
        `upi://pay?pa=${form.upiId}&pn=${form.name}&cu=INR`;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3">

            <div className="bg-white rounded-2xl w-full max-w-md p-5 relative text-black">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                    <FiX size={22} />
                </button>

                <h2 className="text-2xl font-bold text-center mb-4">
                    💳 Online Payment
                </h2>

                {/* FORM */}
                <form onSubmit={saveQR} className="space-y-3">

                    <input
                        type="text"
                        placeholder="UPI ID"
                        value={form.upiId}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                upiId: e.target.value
                            })
                        }
                        className="w-full border p-3 rounded-lg outline-none"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }
                        className="w-full border p-3 rounded-lg outline-none"
                        required
                    />

                    <button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
                    >
                        Save QR
                    </button>

                </form>

                {/* QR SHOW */}
                {showQR && (
                    <div className="mt-6 text-center">

                        <QRCodeCanvas
                            value={upiLink}
                            size={220}
                        />

                        <div className="mt-4 text-sm bg-gray-100 rounded-lg p-3">

                            <table className="w-full text-left">

                                <tbody>

                                    <tr>
                                        <td className="font-semibold py-1">
                                            Name
                                        </td>

                                        <td>
                                            {form.name}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="font-semibold py-1">
                                            UPI ID
                                        </td>

                                        <td>
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
