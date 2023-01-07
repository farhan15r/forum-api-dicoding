const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUsecase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const owner = request.auth.credentials.id;
    const threadId = request.params.threadId;
    const commentId = request.params.commentId;

    const addedReply = await addReplyUseCase.execute({
      content: request.payload.content,
      owner,
      threadId,
      commentId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUsecase.name
    );
    const owner = request.auth.credentials.id;
    const threadId = request.params.threadId;
    const commentId = request.params.commentId;
    const replyId = request.params.replyId;

    await deleteReplyUseCase.execute({
      owner,
      threadId,
      commentId,
      replyId,
    });

    const response = h.response({
      status: 'success',
      message: 'Komentar berhasil dihapus',
    });
    response.code(200);

    return response;
  }
}

module.exports = RepliesHandler;
