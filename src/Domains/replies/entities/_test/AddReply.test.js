const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'ini balasan komentar',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError(
      'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'ini balasan komentar',
      commentId: 'comment-123',
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError(
      'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create AddReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'ini balasan komentar',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const addReply = new AddReply(payload);

    // Assert
    expect(addReply).toBeInstanceOf(AddReply);
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.threadId).toEqual(payload.threadId);
    expect(addReply.owner).toEqual(payload.owner);
  });
});
