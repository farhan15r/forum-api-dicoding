const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedArrayReplies = [
      {
        id: 'reply-123',
        content: 'Dicoding Indonesia',
        date: '2021-08-08T07:26:17.018Z',
        username: 'user-123',
      },
    ];

    const expectedArrayComments = [
      {
        id: 'comment-123',
        content: 'Dicoding Indonesia',
        date: '2021-08-08T07:26:17.018Z',
        username: 'user-123',
        likeCount: 0,
        replies: expectedArrayReplies,
      },
    ];

    const expectedGetThread = new GetThread({
      id: 'thread-123',
      title: 'Dicoding Indonesia',
      body: 'Dicoding Indonesia',
      date: '2021-08-08T07:26:17.018Z',
      username: 'user-123',
      comments: expectedArrayComments,
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: 'comment-123',
            content: 'Dicoding Indonesia',
            date: '2021-08-08T07:26:17.018Z',
            username: 'user-123',
            like_count: 0,
            is_delete: false,
          },
        ])
      );
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: 'reply-123',
            content: 'Dicoding Indonesia',
            date: '2021-08-08T07:26:17.018Z',
            username: 'user-123',
            is_delete: false,
          },
        ])
      );
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'Dicoding Indonesia',
        body: 'Dicoding Indonesia',
        date: '2021-08-08T07:26:17.018Z',
        username: 'user-123',
      })
    );

    // creating use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual(expectedGetThread);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(
      'comment-123'
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    );
  });
});
