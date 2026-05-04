const express = require('express');
const auth = require('../middleware/authMiddleware');
const Event = require('../models/Entry');

const router = express.Router();

router.post('/event', auth, async (req, res) => {
    try {
        const { eventType, personName, eventDate } = req.body;

        if (!eventType || !personName || !eventDate) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        const newEvent = new Event({
            user: req.user,
            eventType,
            personName,
            eventDate,
            entries: []
        });

        const event = await newEvent.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/add', auth, async (req, res) => {
    try {
        const { eventId, fullName, address, pincode, amount } = req.body;

        const event = await Event.findOne({ _id: eventId, user: req.user });
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        const newEntry = { fullName, address, pincode, amount };
        event.entries.push(newEntry);
        await event.save();

        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/my-events', auth, async (req, res) => {
    try {
        const events = await Event.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:eventId/:entryId', auth, async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.eventId, user: req.user });
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        event.entries = event.entries.filter(
            entry => entry._id.toString() !== req.params.entryId
        );

        await event.save();
        res.json({ msg: 'Entry deleted', event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:eventId/:entryId', auth, async (req, res) => {
    try {
        const { fullName, address, pincode, amount } = req.body;
        const event = await Event.findOne({ _id: req.params.eventId, user: req.user });
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        const entry = event.entries.id(req.params.entryId);
        if (!entry) return res.status(404).json({ msg: 'Entry not found' });

        entry.fullName = fullName;
        entry.address = address;
        entry.pincode = pincode;
        entry.amount = amount;

        await event.save();
        res.json({ msg: 'Entry will updated', event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;