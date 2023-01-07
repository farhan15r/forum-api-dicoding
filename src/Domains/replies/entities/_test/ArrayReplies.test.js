const ArrayReplies = require('../ArrayReplies');

describe('a ArrayReplies entities', () => {
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'ini balasan',
    };

    // Action and Assert
    expect(() => new ArrayReplies(payload)).toThrowError(
      'ARRAY_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = [
      {
        id: 'reply-123',
        content: 'ini balasan',
      },
    ];

    // Action and Assert
    expect(() => new ArrayReplies(payload)).toThrowError(
      'ARRAY_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = [
      {
        id: 123,
        content: 'ini balasan',
        date: '2021-08-08T07:07:46.000Z',
        username: 'dicoding',
      },
    ];

    // Action and Assert
    expect(() => new ArrayReplies(payload)).toThrowError(
      'ARRAY_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create ArrayReplies object correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'reply-123',
        content: 'ini balasan',
        date: '2021-08-08T07:07:46.000Z',
        username: 'dicoding',
      },
    ];

    // Action
    const arrayReplies = new ArrayReplies(payload);

    // Assert
    expect(arrayReplies.replies).toStrictEqual(payload);
  });
});
