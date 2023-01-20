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

  it('should throw error when not given payload', () => {
    // Action and Assert
    expect(() => new ArrayComments()).toThrowError(
      'ARRAY_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should not throw error when payload is meet data type specification but not have length', () => {
    // Arrange
    const payload = [];

    // Action and Assert
    expect(() => new ArrayComments(payload)).not.toThrowError(
      'ARRAY_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
    expect(() => new ArrayComments(payload)).not.toThrowError(
      'ARRAY_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY'
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
        is_delete: false,
        like_count: 0,
        replies: [],
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
        is_delete: true,
        like_count: 0,
        replies: [],
      },
      {
        id: 'comment-124',
        content: 'ini komentar',
        date: '2021-08-08T07:07:46.000Z',
        username: 'dicoding',
        is_delete: false,
        like_count: 0,
        replies: [],
      },
    ];

    const expected = [
      {
        id: 'comment-123',
        content: '**komentar telah dihapus**',
        date: '2021-08-08T07:07:46.000Z',
        username: 'dicoding',
        likeCount: 0,
        replies: [],
      },
      {
        id: 'comment-124',
        content: 'ini komentar',
        date: '2021-08-08T07:07:46.000Z',
        username: 'dicoding',
        likeCount: 0,
        replies: [],
      },
    ];

    // Action
    const arrayComments = new ArrayComments(payload);

    // Assert
    expect(arrayComments).toBeInstanceOf(ArrayComments);
    expect(arrayComments.comments).toStrictEqual(expected);
  });
});
