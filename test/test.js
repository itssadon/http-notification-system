import request from 'supertest';
import app from '../app';

describe('App', function () {
  it('has the default page', function (done) {
    request(app)
      .get('/')
      .expect(/Welcome to Express/, done);
  });
});