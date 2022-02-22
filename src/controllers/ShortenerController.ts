import { Request, Response } from 'express'
import UrlModel from '../models/UrlModel';

class ShortenerController {
  async redirectUrl (req: Request, res: Response) {
    const { shortId } = req.params;
    
    if (!shortId) {
      return res.status(400).json({ message: 'shortId is not provided'})
    }

    try {
      const record = await UrlModel.findOne({ shortId });
      if (record) {
        return res.redirect(record.url);
      }
      return res.status(400).json({ message: 'shortId is invalid' })
    } catch (error) {
      return res.status(500).json( {message: 'Something went wrong' })
    }
  }


  async shortenUrl (req: any, res:any) {
    return res.status(400)
  }
}
export default new ShortenerController();