class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, commentId, owner } = payload;

    this.content = content;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload.content || !payload.commentId || !payload.owner) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof payload.content !== 'string' ||
      typeof payload.commentId !== 'string' ||
      typeof payload.owner !== 'string'
    ) {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
