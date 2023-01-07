const ArrayComments = require('../ArrayComments');

describe('a ArrayComments entities', () => {
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'ini komentar',
    };

    // Action and Assert
    expect(() => new ArrayComments(payload)).toThrowError(
      'ARRAY_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-123',
        content: 'ini komentar',
      },
    ];

    // Action and Assert
    expect(() => new ArrayComments(payload)).toThrowError(
      'ARRAY_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = [
      {
        id: 123,
        content: 'ini komentar',
        date: '2021-08-08T07:07:46.000Z',
        username: 'dicoding',
      },
    ];

    // Action and Assert
    expect(() => new ArrayComments(payload)).toThrowError(
      'ARRAY_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create ArrayComments object correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-123',
        content: 'ini komentar',
        date: '2021-08-08T07:07:46.000Z',
        username: 'dicoding',
      },
    ];

    // Action
    const arrayComments = new ArrayComments(payload);

    // Assert
    expect(arrayComments).toBeInstanceOf(ArrayComments);
    expect(arrayComments.comments).toEqual(payload);
  });
});