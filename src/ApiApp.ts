import express, { Application } from 'express';
import router from './routers/ShortenUrl';

class ApiApp {
  private app: Application;

  constructor() {
    this.app = express();
    this.setupGlobalMiddleware();
    this.setupRouters();
  }

  start(port: string | number = 3000) {
    return this.app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`listening on port ${port}`);
    });
  }

  getApp() {
    return this.app;
  }

  private setupGlobalMiddleware() {
    this.app.use(express.json());
  }

  private setupRouters() {
    this.app.get('/', (_, res) => {
      res.json({ message: 'Welcome to our service!'});
    });

    this.app.use('/urls', router.getRouter());
  }
}

export default new ApiApp();
