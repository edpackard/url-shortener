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
  })

})