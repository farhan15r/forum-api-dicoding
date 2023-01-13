const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ArrayReplies = require('../../../Domains/replies/entities/ArrayReplies');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
      });

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        date: new Date().toISOString(),
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        date: new Date().toISOString(),
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const addReply = new AddReply({
        content: 'sebuah reply',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
      });

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        date: new Date().toISOString(),
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        date: new Date().toISOString(),
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const addReply = new AddReply({
        content: 'sebuah reply',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: 'sebuah reply',
          commentId: 'comment-123',
          owner: 'user-123',
        })
      );
    });
  });

  describe('checkAvailabilityReply function', () => {
    it('should throw error when comment not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.checkAvailabilityReply('reply-123')
      ).rejects.toThrowError('balasan tidak ditemukan');
    });

    it('should not throw error when comment available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        date: new Date().toISOString(),
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        commentId: 'comment-123',
        owner: 'user-123',
        date: new Date().toISOString(),
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.checkAvailabilityReply('reply-123')
      ).resolves.not.toThrowError('balasan tidak ditemukan');

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw error when reply owner not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        date: new Date().toISOString(),
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        commentId: 'comment-123',
        owner: 'user-123',
        date: new Date().toISOString(),
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456')
      ).rejects.toThrowError('anda tidak berhak mengakses resource ini');
    });

    it('should not throw error when reply owner match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        date: new Date().toISOString(),
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        commentId: 'comment-123',
        owner: 'user-123',
        date: new Date().toISOString(),
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')
      ).resolves.not.toThrowError('anda tidak berhak mengakses resource ini');
    });
  });

  describe('deleteReply function', () => {
    it('should persist delete reply', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        date: new Date().toISOString(),
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        commentId: 'comment-123',
        owner: 'user-123',
        date: new Date().toISOString(),
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply('reply-123');

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');

      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        date: new Date().toISOString(),
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        threadId: 'thread-123',
        date: new Date('2021-01-01').toISOString(),
        owner: 'user-123',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        commentId: 'comment-123',
        date: new Date('2021-01-01').toISOString(),
        owner: 'user-123',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        content: 'sebuah reply',
        commentId: 'comment-123',
        date: new Date('2022-01-02').toISOString(),
        owner: 'user-123',
      });

      await RepliesTableTestHelper.deleteReplyById('reply-456');

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId(
        'comment-123'
      );

      const arrayReplies = new ArrayReplies(replies);

      // Assert
      expect(arrayReplies.replies).toHaveLength(2);

      const reply1 = arrayReplies.replies[0];
      const reply2 = arrayReplies.replies[1];

      expect(reply1.id).toEqual('reply-123');
      expect(reply1.content).toEqual('sebuah reply');
      expect(reply1.date).toEqual(new Date('2021-01-01').toISOString());
      expect(reply1.username).toEqual('dicoding');

      expect(reply2.id).toEqual('reply-456');
      expect(reply2.content).toEqual('**balasan telah dihapus**');
      expect(reply2.date).toEqual(new Date('2022-01-02').toISOString());
      expect(reply2.username).toEqual('dicoding');
    });
  });
});
