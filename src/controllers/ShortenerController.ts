import { Request, Response } from 'express'
import UrlModel from '../models/UrlModel';

import IdGenerator from 'shortid'
import Validator from 'validator'

class ShortenerController {
  async redirectUrl (req: Request, res: Response) {
    const { shortId } = req.params;
    
    if (!shortId) {
      return res.status(400).json({ message: 'shortId is not provided'})
    }

    try {
      const record = await UrlModel.findOne({ shortId });
      if (!record) {
        return res.status(400).json({ message: 'shortId is invalid' })
      }
      return res.redirect(record.url);

    } catch (error) {
      return res.status(500).json( {message: 'Something went wrong' })
    }
  }


  async shortenUrl (req: Request, res: Response) {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'url is not provided' })
    }

    if (!Validator.isURL(url, { require_protocol: true} )) {
      return res.status(400).json({ message: 'url is invalid' })
    }

    try {
      const record = await UrlModel.findOne({ url });
      
      if (record) {
        return res.status(200).json( { url, shortId: record.shortId })
      }

      const newUrl = {
        url,
        shortId: IdGenerator.generate(),
      };

      await UrlModel.create(newUrl);
      return res.status(200).json(newUrl);
    } catch (e) {
      return res.status(500).json({ message: 'Something went wrong' })
    }
  }
}
export default new ShortenerController();