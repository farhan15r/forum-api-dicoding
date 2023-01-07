const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkAvailabilityThread(
      useCasePayload.threadId
    );
    await this._commentRepository.checkAvailabilityComment(
      useCasePayload.commentId
    );
    const addReply = new AddReply(useCasePayload);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
