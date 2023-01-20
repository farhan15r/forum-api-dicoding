const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('countLike function', () => {
    it('should return count of like correctly', async () => {
      // Arrange
      LikesTableTestHelper.addLike({});

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      const count = await likeRepositoryPostgres.countLike('comment-123');

      // Assert
      expect(count).toEqual(1);
    });
  });

  describe('checkIsLiked function', () => {
    it('should return like correctly', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({});

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      const like = await likeRepositoryPostgres.checkIsLiked(
        'comment-123',
        'user-123'
      );

      // Assert
      expect(like).toBeDefined();
      expect(like).toEqual(1);
    });

    it('should return empty array when like not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      const like = await likeRepositoryPostgres.checkIsLiked(
        'comment-123',
        'user-123'
      );

      // Assert
      expect(like).toEqual(0);
    });
  });

  describe('addLike function', () => {
    it('should persist add like and return added like correctly', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.addLike('comment-123', 'user-123');

      // Assert
      const likes = await LikesTableTestHelper.findLikesByCommentId(
        'comment-123'
      );
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should persist delete like and return deleted like correctly', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({});

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.deleteLike('comment-123', 'user-123');

      // Assert
      const likes = await LikesTableTestHelper.findLikesByCommentId(
        'comment-123'
      );
      expect(likes).toHaveLength(0);
    });
  });
});
