import dotenv from 'dotenv';
import mongoose from 'mongoose';

import ApiApp from './ApiApp';

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  ApiApp.start(process.env.PORT);
})();