import proxyquire from 'proxyquire';
import assert from 'assert';
import sinon from 'sinon';

const wrapEndpointSpy = sinon.spy();

const setupRoutes = proxyquire('../src/setupRoutes', {
  './createContext': { default: () => ({}) },
  './wrapEndpoint': { default: wrapEndpointSpy }
}).default;

describe('setupRoutes.js', () => {
  beforeEach(() => {
    wrapEndpointSpy.resetHistory();
  });

  describe('setupRoutes(server)', () => {
    let fakeServer;

    beforeEach(() => {
      fakeServer = {
        get: sinon.spy(),
        post: sinon.spy(),
        del: sinon.spy(),
        patch: sinon.spy(),
        put: sinon.spy()
      };
    });

    it('registers the route GET /v1/info', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.get.called);
      assert(fakeServer.get.calledWithMatch('/v1/info'));
    });

    it('registers the route GET /v1/users', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.get.called);
      assert(fakeServer.get.calledWithMatch('/v1/users'));
    });

    it('registers the route POST /v1/users', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.post.called);
      assert(fakeServer.post.calledWithMatch('/v1/users'));
    });

    it('registers the route GET /v1/users/:id', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.get.called);
      assert(fakeServer.get.calledWithMatch('/v1/users/:id'));
    });

    it('registers the route PATCH /v1/users/:id', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.patch.called);
      assert(fakeServer.patch.calledWithMatch('/v1/users/:id'));
    });

    it('registers the route GET /v1/users/:userId/avatar', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.get.called);
      assert(fakeServer.get.calledWithMatch('/v1/users/:userId/avatar'));
    });

    it('registers the route PUT /v1/users/:userId/avatar', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.put.called);
      assert(fakeServer.put.calledWithMatch('/v1/users/:userId/avatar'));
    });

    it('registers the route POST /v1/users/:userId/device-tokens', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.post.called);
      assert(fakeServer.post.calledWithMatch('/v1/users/:userId/device-tokens'));
    });

    it('registers the route DELETE /v1/users/:userId/device-tokens/:id', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.del.called);
      assert(fakeServer.del.calledWithMatch('/v1/users/:userId/device-tokens/:id'));
    });

    it('registers the route GET /v1/users/:userId/contact-requests', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.get.called);
      assert(fakeServer.get.calledWithMatch('/v1/users/:userId/contact-requests'));
    });

    it('registers the route POST /v1/users/:userId/contact-requests', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.post.called);
      assert(fakeServer.post.calledWithMatch('/v1/users/:userId/contact-requests'));
    });

    it('registers the route DELETE /v1/users/:userId/contact-requests/:id', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.del.called);
      assert(fakeServer.del.calledWithMatch('/v1/users/:userId/contact-requests/:id'));
    });

    it('registers the route GET /v1/users/:userId/contacts', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.get.called);
      assert(fakeServer.get.calledWithMatch('/v1/users/:userId/contacts'));
    });

    it('registers the route POST /v1/users/:userId/contacts', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.post.called);
      assert(fakeServer.post.calledWithMatch('/v1/users/:userId/contacts'));
    });

    it('registers the route DELETE /v1/users/:userId/contacts/:id', () => {
      setupRoutes(fakeServer);

      assert(fakeServer.del.called);
      assert(fakeServer.del.calledWithMatch('/v1/users/:userId/contacts/:id'));
    });

    it('wraps each endpoint with wrapEndpoint()', () => {
      setupRoutes(fakeServer);
      assert.equal(wrapEndpointSpy.callCount, 15);
    });
  });
});
