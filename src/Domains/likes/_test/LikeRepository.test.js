const LikeRepository = require('../LikeRepossitory');

describe('a LikeRepository entities', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(likeRepository.countLike({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likeRepository.countLike({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likeRepository.deleteLike({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(likeRepository.checkIsLiked({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
