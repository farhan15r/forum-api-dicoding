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

  it('should throw error when not given payload', () => {
    // Action and Assert
    expect(() => new ArrayReplies()).toThrowError(
      'ARRAY_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should not throw error when payload is meet data type specification but not have length', () => {
    // Arrange
    const payload = [];

    // Action and Assert
    expect(() => new ArrayReplies(payload)).not.toThrowError(
      'ARRAY_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
    expect(() => new ArrayReplies(payload)).not.toThrowError(
      'ARRAY_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY'
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
        is_delete: false,
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
        is_delete: false,
      },
      {
        id: 'reply-124',
        content: 'ini balasan',
        date: '2021-08-08T07:07:46.000Z',
        username: 'dicoding',
        is_delete: true,
      },
    ];

    const expected = [
      {
        id: 'reply-123',
        content: 'ini balasan',
        date: '2021-08-08T07:07:46.000Z',
        username: 'dicoding',
      },
      {
        id: 'reply-124',
        content: '**balasan telah dihapus**',
        date: '2021-08-08T07:07:46.000Z',
        username: 'dicoding',
      },
    ];

    // Action
    const arrayReplies = new ArrayReplies(payload);

    // Assert
    expect(arrayReplies.replies).toStrictEqual(expected);
  });
});
