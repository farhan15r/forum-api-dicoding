const UpdateLikesCommentUseCase = require('../../../../Applications/use_case/UpdateLikesCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const updateLikesCommentUseCase = this._container.getInstance(
      UpdateLikesCommentUseCase.name
    );

    const owner = request.auth.credentials.id;
    const { threadId, commentId } = request.params;

    await updateLikesCommentUseCase.execute({
      threadId,
      commentId,
      owner,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);

    return response;
  }
}

module.exports = LikesHandler;
