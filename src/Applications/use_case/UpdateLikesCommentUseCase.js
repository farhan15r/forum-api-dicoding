class UpdateLikesCommentUseCase {
  constructor({ commentRepository, threadRepository, likeRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { commentId, threadId, owner } = useCasePayload;

    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    const isLiked = await this._likeRepository.checkIsLiked(commentId, owner);

    if (isLiked) {
      await this._likeRepository.deleteLike(commentId, owner);
    } else {
      await this._likeRepository.addLike(commentId, owner);
    }

    const countLike = await this._likeRepository.countLike(commentId);
    await this._commentRepository.updateLikeCountComment(commentId, countLike);
    return countLike;
  }

  _verifyPayload(payload) {
    const { commentId, threadId, owner } = payload;
    if (!commentId || !threadId || !owner) {
      throw new Error(
        'UPDATE_LIKES_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'
      );
    }

    if (
      typeof commentId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error(
        'UPDATE_LIKES_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = UpdateLikesCommentUseCase;
