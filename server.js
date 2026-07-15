import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './routes/renik.js';
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());
app.use(cookieParser())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log(`Listening color your night`);
});
