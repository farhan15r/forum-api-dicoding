class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload.id || !payload.content || !payload.owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof payload.id !== 'string' ||
      typeof payload.content !== 'string' ||
      typeof payload.owner !== 'string'
    ) {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
