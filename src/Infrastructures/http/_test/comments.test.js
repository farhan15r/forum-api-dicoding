const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding',
      };

      const server = await createServer(container);

      // register user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { accessToken } = JSON.parse(responseLogin.payload).data;

      // add thread
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'dicoding',
          body: 'lorem ipsum dolor sit amet',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        addedThread: { id: threadId },
      } = JSON.parse(responseThread.payload).data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();

      // Check comment in database
      const comments = await CommentsTableTestHelper.findCommentsById(
        responseJson.data.addedComment.id
      );
      expect(comments).toHaveLength(1);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding',
      };

      const server = await createServer(container);

      // register user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { accessToken } = JSON.parse(responseLogin.payload).data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };

      const server = await createServer(container);

      // register user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { accessToken } = JSON.parse(responseLogin.payload).data;

      // add thread
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'dicoding',
          body: 'lorem ipsum dolor sit amet',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        addedThread: { id: threadId },
      } = JSON.parse(responseThread.payload).data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          requestPayload,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'
      );
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment', async () => {
      // Arrange
      const server = await createServer(container);

      // register user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { accessToken } = JSON.parse(responseLogin.payload).data;

      // add thread
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread',
          body: 'lorem ipsum dolor sit amet',
        },

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        addedThread: { id: threadId },
      } = JSON.parse(responseThread.payload).data;

      // add comment
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comment',
        },

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        addedComment: { id: commentId },
      } = JSON.parse(responseComment.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // register user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { accessToken } = JSON.parse(responseLogin.payload).data;

      // add thread
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread',
          body: 'lorem ipsum dolor sit amet',
        },

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        addedThread: { id: threadId },
      } = JSON.parse(responseThread.payload).data;

      // add comment
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comment',
        },

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        addedComment: { id: commentId },
      } = JSON.parse(responseComment.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/123/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container);

      // register user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { accessToken } = JSON.parse(responseLogin.payload).data;

      // add thread
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread',
          body: 'lorem ipsum dolor sit amet',
        },

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        addedThread: { id: threadId },
      } = JSON.parse(responseThread.payload).data;

      // add comment
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comment',
        },

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 403 when user not authorized', async () => {
      // Arrange
      const server = await createServer(container);

      // register user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // register user2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      // login user2
      const responseLogin2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'secret',
        },
      });

      const { accessToken } = JSON.parse(responseLogin.payload).data;
      const { accessToken: accessToken2 } = JSON.parse(
        responseLogin2.payload
      ).data;

      // add thread
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread',
          body: 'lorem ipsum dolor sit amet',
        },

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        addedThread: { id: threadId },
      } = JSON.parse(responseThread.payload).data;

      // add comment
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comment',
        },

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        addedComment: { id: commentId },
      } = JSON.parse(responseComment.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'anda tidak berhak mengakses resource ini'
      );
    });
  });
});
