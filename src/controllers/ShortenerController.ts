class ShortenerController {
  async redirectUrl (req: any, res: any) {
    return res.status(400).json({ message: 'shortId is not provided'})
  }

  async shortenUrl (req: any, res:any) {
    throw new Error('Not implemented yet!');
  }
}
export default new ShortenerController();