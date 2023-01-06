class AddComent {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, threadId, owner } = payload;

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload.content || !payload.threadId || !payload.owner) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof payload.content !== 'string' ||
      typeof payload.threadId !== 'string' ||
      typeof payload.owner !== 'string'
    ) {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComent;
