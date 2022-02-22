import { Request, Response } from 'express'
import UrlModel from '../models/UrlModel';

class ShortenerController {
  async redirectUrl (req: Request, res: Response) {
    const { shortId } = req.params;
    if (!shortId) {
      return res.status(400).json({ message: 'shortId is not provided'})
    }

    const record = await UrlModel.findOne({ shortId });
    if (record) {
      return res.redirect(record.url);
    }
  }
  async shortenUrl (req: any, res:any) {
    throw new Error('Not implemented yet!');
  }
}
export default new ShortenerController();