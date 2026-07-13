import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './routes/renik.js';


const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log(`Listening color your night`);
});
