import express from 'express';
import cors from 'cors';
import generateRoute from './perplexity.js';

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.post('/api/input', async (req, res) => {
  try {
    // console.log(req.body);
    let originZipcode = 28205;
    let destinationZipcode = 28208;
    let transportationMethod = 'bike';
    let time = '8:00 AM';
    let day = 'Tuesday';

    try {
      const generatedRes = await generateRoute(
        originZipcode,
        destinationZipcode,
        transportationMethod,
        time,
        day
      );
      console.log('Generated route response:', generatedRes);
      res.json(generatedRes);
    } catch (err) {
      console.log('Error fetching generated route from Perplexity:' + err);
      res.json({ error: 'Error fetching generated route from Perplexity' });
    }
  } catch (err) {
    console.log(`Error fetching AI-generated response: ${err}`);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
