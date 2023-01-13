const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ArrayComments = require('../../../Domains/comments/entities/ArrayComments');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: addComment.content,
          threadId: addComment.threadId,
          owner: addComment.owner,
        })
      );
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw error when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkAvailabilityComment('comment-123')
      ).rejects.toThrowError('komentar tidak ditemukan');
    });

    it('should not throw error when comment available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkAvailabilityComment('comment-123')
      ).resolves.not.toThrowError('komentar tidak ditemukan');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );
      expect(comments).toHaveLength(1);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw error when comment owner not match', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456')
      ).rejects.toThrowError('anda tidak berhak mengakses resource ini');
    });

    it('should not throw error when comment owner match', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')
      ).resolves.not.toThrowError('anda tidak berhak mengakses resource ini');
    });
  });

  describe('deleteComment function', () => {
    it('should persist deleted comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should persist get comment by thread id', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        date: '2020-01-12T16:36:10.653Z',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        date: '2021-01-12T16:36:10.653Z',
      });

      await CommentsTableTestHelper.deleteCommentById('comment-456');

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123'
      );

      comments[0].replies = [];
      comments[1].replies = [];

      const arrayComments = new ArrayComments(comments);

      // Assert
      expect(arrayComments.comments).toHaveLength(2);

      const comment1 = arrayComments.comments[0];
      const comment2 = arrayComments.comments[1];

      expect(comment1.id).toEqual('comment-123');
      expect(comment1.content).toEqual('sebuah comment');
      expect(comment1.date).toEqual('2020-01-12T16:36:10.653Z');
      expect(comment1.username).toEqual('dicoding');

      expect(comment2.id).toEqual('comment-456');
      expect(comment2.content).toEqual('**komentar telah dihapus**');
      expect(comment2.date).toEqual('2021-01-12T16:36:10.653Z');
      expect(comment2.username).toEqual('dicoding');
    });
  });
});
