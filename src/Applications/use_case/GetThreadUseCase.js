const ArrayComments = require('../../Domains/comments/entities/ArrayComments');
const ArrayReplies = require('../../Domains/replies/entities/ArrayReplies');
const GetThread = require('../../Domains/threads/entities/GetThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    await this._threadRepository.checkAvailabilityThread(threadId);

    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(
          comment.id
        );
        const arrayReplies = new ArrayReplies(replies);
        comment.replies = arrayReplies.replies;
      })
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
