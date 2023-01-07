const ArrayComments = require('../../Domains/comments/entities/ArrayComments');
const GetThread = require('../../Domains/threads/entities/GetThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    await this._threadRepository.checkAvailabilityThread(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    const arrayComments = new ArrayComments(comments);

    const getThread = await this._threadRepository.getThreadById(threadId);

    return new GetThread({
      ...getThread,
      comments: arrayComments.comments,
    });
  }
}

module.exports = GetThreadUseCase;
