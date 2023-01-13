const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '12345'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadsById(
        'thread-12345'
      );
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '12345'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-12345',
          title: addThread.title,
          body: addThread.body,
          owner: addThread.owner,
        })
      );
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should throw error when thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        threadRepositoryPostgres.checkAvailabilityThread('thread-123')
      ).rejects.toThrowError('thread tidak ditemukan');
    });

    it('should not throw error when thread available', async () => {
      // Arrange
      await ThreadTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        threadRepositoryPostgres.checkAvailabilityThread('thread-123')
      ).resolves.not.toThrowError('thread tidak ditemukan');
    });
  });

  describe('getThreadById funtion', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await ThreadTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        date: '2020-01-12T16:36:10.653Z',
        username: 'dicoding',
      });
    });
  });
});
