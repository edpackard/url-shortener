import { Request, Response } from "express";
import { mocked } from 'ts-jest/utils';
import Validator from 'validator';
import IdGenerator from 'shortid';

import Controller from '../controllers/ShortenerController';
import { MockedObject } from 'ts-jest/dist/utils/testing';
import UrlModel, { IUrlDocument } from '../models/UrlModel';
import Mock = jest.Mock;

// Mock UrlModel, and third party libraries
jest.mock('../models/UrlModel');
jest.mock('validator');
jest.mock('shortid');

describe('ShortenerController', () => {
  const shortId = 'short-id';
  const urlRecord = {
    url: 'destination-url',
  } as unknown as IUrlDocument;
  const body = {
    url: 'too-long-url',
  };
  
  let request: Request;
  let response: Response;
  let statusFn: Mock;
  let jsonFn: Mock;

  let redirectFn: Mock;
  let UrlModelMock: MockedObject<typeof UrlModel>;
  let ValidatorMock: MockedObject<typeof Validator>;
  let IdGeneratorMock: MockedObject<typeof IdGenerator>;

  beforeEach(() => {
    statusFn = jest.fn().mockReturnThis();
    jsonFn = jest.fn().mockReturnThis();
    redirectFn = jest.fn().mockReturnThis();

    UrlModelMock = mocked(UrlModel);
    ValidatorMock = mocked(Validator);
    IdGeneratorMock = mocked(IdGenerator) as unknown as MockedObject<typeof IdGenerator>

    // Create response object with some mock functions
    response = {
      json: jsonFn,
      status: statusFn,
      redirect: redirectFn,
    } as Partial<Response> as Response;

    request = {} as unknown as Request;
    request.params = { shortId };
    request.body = body;
  })

  afterEach(() => {
    jest.resetAllMocks();
  });
  
  describe('redirectUrl', () => {
    it('should respond with status 400 when shortId is not provided', async () => {
      request.params = {};
      await Controller.redirectUrl(request, response);
      expect(statusFn).toHaveBeenCalledWith(400);
      expect(jsonFn).toHaveBeenCalledWith({ message: 'shortId is not provided' });
      expect(redirectFn).not.toHaveBeenCalled();
    })

    it('should redirect to destination url when it exists in db', async () => {
      UrlModelMock.findOne.mockResolvedValue(urlRecord);
      await Controller.redirectUrl(request, response);
      expect(UrlModelMock.findOne).toHaveBeenCalledWith({ shortId });
      expect(statusFn).not.toHaveBeenCalled();
      expect(jsonFn).not.toHaveBeenCalled();
      expect(redirectFn).toHaveBeenCalledWith(urlRecord.url);
    })

    it('should respond with status 400 when shortId does not exist in db', async () => {
      UrlModelMock.findOne.mockResolvedValue(null);
      await Controller.redirectUrl(request, response);
      expect(UrlModelMock.findOne).toHaveBeenCalledWith({ shortId });
      expect(statusFn).toHaveBeenCalledWith(400);
      expect(jsonFn).toHaveBeenCalledWith({ message: 'shortId is invalid' });
      expect(redirectFn).not.toHaveBeenCalled();
    });

    it('should respond with status 500 when repository throws an error', async () => {
      //mock findone function throws an error
      UrlModelMock.findOne.mockRejectedValue(new Error('Timed out!'));
      await Controller.redirectUrl(request, response);
      expect(UrlModelMock.findOne).toHaveBeenCalledWith({ shortId });
      expect(statusFn).toHaveBeenCalledWith(500);
      expect(jsonFn).toHaveBeenCalledWith({ message: "Something went wrong" });
      expect(redirectFn).not.toHaveBeenCalled();
    })

    describe('shortenUrl', () => {
      beforeEach(() => {
        ValidatorMock.isURL.mockReturnValue(true);
      })

      it('should respond with status 400 when url is not provided', async () => {
        request.body = {};
        await Controller.shortenUrl(request, response);
        expect(statusFn).toHaveBeenCalledWith(400);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'url is not provided' });
      })

      it('should respond with status 400 when url is invalid', async () => {
        ValidatorMock.isURL.mockReturnValue(false);

        await Controller.shortenUrl(request, response);
        expect(ValidatorMock.isURL).toHaveBeenCalledWith(body.url, expect.any(Object));
        expect(statusFn).toHaveBeenCalledWith(400);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'url is invalid'})
      })
      
      it('should respond with new shortId when request successful', async () => {
        const newShortId = 'new-short-id';
        IdGeneratorMock.generate.mockReturnValue(newShortId);
        await Controller.shortenUrl(request, response);

        expect(ValidatorMock.isURL).toHaveBeenCalledWith(body.url, expect.any(Object));
        expect(UrlModelMock.create).toHaveBeenCalledWith({ url: body.url, shortId: newShortId});

        expect(statusFn).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith({ url: body.url, shortId: newShortId });
      })

      it('should respond with existing shortId when relevant', async () => {
        UrlModelMock.findOne.mockResolvedValue({ shortId } as unknown as IUrlDocument);
        await Controller.shortenUrl(request, response);
        expect(ValidatorMock.isURL).toHaveBeenCalledWith(body.url, expect.any(Object));
        expect(UrlModelMock.create).not.toHaveBeenCalled();
        expect(UrlModelMock.findOne).toHaveBeenCalledWith({ url: body.url });
        expect(statusFn).toHaveBeenCalledWith(200);
        expect(jsonFn).toHaveBeenCalledWith({ url: body.url, shortId });
      })

      it('should respond with status 500 when UrlModelMock.findOne throws error', async () => {
        UrlModelMock.findOne.mockRejectedValue(new Error('Timed out!'));
        await Controller.shortenUrl(request, response);
        expect(ValidatorMock.isURL).toHaveBeenCalledWith(body.url, expect.any(Object));
        expect(UrlModelMock.create).not.toHaveBeenCalled();
        expect(statusFn).toHaveBeenCalledWith(500);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Something went wrong' })
      })

      it('should respond with status 500 when UrlModelMock.create throws error', async () => {
        UrlModelMock.create.mockRejectedValue(new Error('Timed out!') as never);
        await Controller.shortenUrl(request, response);
        expect(ValidatorMock.isURL).toHaveBeenCalledWith(body.url, expect.any(Object));
        expect(UrlModelMock.create).toHaveBeenCalled();
        expect(UrlModelMock.findOne).toHaveBeenCalledWith({ url: body.url });
        expect(statusFn).toHaveBeenCalledWith(500);
        expect(jsonFn).toHaveBeenCalledWith({ message: 'Something went wrong' })
      })
    })
  })


})