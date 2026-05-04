const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://shagun-sigma.vercel.app'
    ],
    credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => {
        console.error('DB Error:', err);
        process.exit(1);
    });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/entries', require('./routes/entries'));

app.get('/', (req, res) => {
    res.send('Shagun API running');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});