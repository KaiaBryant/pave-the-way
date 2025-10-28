import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions));

app.post('/api/input', async (req, res) => {
    try {
        console.log(req.body);
    } catch (err) {
        console.log(`Error fetching AI-generated response: ${err}`);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
