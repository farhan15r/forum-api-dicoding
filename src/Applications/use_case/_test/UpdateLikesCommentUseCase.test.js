const UpdateLikesCommentUseCase = require('../UpdateLikesCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepossitory');

describe('a UpdateLikesCommentUseCase entities', () => {
  beforeEach(() => {
    this.mockCommentRepository = new CommentRepository();
    this.mockThreadRepository = new ThreadRepository();
    this.mockLikeRepository = new LikeRepository();

    this.mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
      Promise.resolve()
    );
    this.mockCommentRepository.checkAvailabilityComment = jest.fn(() =>
      Promise.resolve()
    );
    this.mockLikeRepository.addLike = jest.fn(() => Promise.resolve());
    this.mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());
    this.mockLikeRepository.countLike = jest.fn(() => Promise.resolve(2));
    this.mockCommentRepository.updateLikeCountComment = jest.fn(() =>
      Promise.resolve()
    );
  });

  afterEach(() => {
    this.mockThreadRepository.checkAvailabilityThread.mockClear();
    this.mockCommentRepository.checkAvailabilityComment.mockClear();
    this.mockLikeRepository.addLike.mockClear();
    this.mockLikeRepository.deleteLike.mockClear();
    this.mockLikeRepository.countLike.mockClear();
    this.mockCommentRepository.updateLikeCountComment.mockClear();
  });

  it('should orchestrating the add comment action correctly, like add', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const useCase = new UpdateLikesCommentUseCase({
      commentRepository: this.mockCommentRepository,
      threadRepository: this.mockThreadRepository,
      likeRepository: this.mockLikeRepository,
    });

    this.mockLikeRepository.checkIsLiked = jest.fn(() =>
      Promise.resolve(false)
    );

    // Action
    await useCase.execute(useCasePayload);

    // Assert
    expect(this.mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(this.mockCommentRepository.checkAvailabilityComment).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(this.mockLikeRepository.checkIsLiked).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(this.mockLikeRepository.addLike).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(this.mockLikeRepository.deleteLike).not.toBeCalled();
  });

  it('should orchestrating the add comment action correctly, like delete', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const useCase = new UpdateLikesCommentUseCase({
      commentRepository: this.mockCommentRepository,
      threadRepository: this.mockThreadRepository,
      likeRepository: this.mockLikeRepository,
    });

    this.mockLikeRepository.checkIsLiked = jest.fn(() => Promise.resolve(true));

    // Action
    await useCase.execute(useCasePayload);

    // Assert
    expect(this.mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
      useCasePayload.threadId
    );

    expect(this.mockCommentRepository.checkAvailabilityComment).toBeCalledWith(
      useCasePayload.commentId
    );

    expect(this.mockLikeRepository.checkIsLiked).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );

    expect(this.mockLikeRepository.deleteLike).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );

    expect(this.mockLikeRepository.addLike).not.toBeCalled();
  });

  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const useCase = new UpdateLikesCommentUseCase({
      commentRepository: this.mockCommentRepository,
      threadRepository: this.mockThreadRepository,
      likeRepository: this.mockLikeRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(
      'UPDATE_LIKES_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 123,
      threadId: 123,
      owner: 123,
    };

    const useCase = new UpdateLikesCommentUseCase({
      commentRepository: this.mockCommentRepository,
      threadRepository: this.mockThreadRepository,
      likeRepository: this.mockLikeRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(
      'UPDATE_LIKES_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
});
