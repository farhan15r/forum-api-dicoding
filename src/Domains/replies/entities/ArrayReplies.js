class ArrayReplies {
  constructor(payload) {
    this._verifyPayload(payload);

    this.replies = this._softDeleteContent(payload);
  }

  _verifyPayload(payload) {
    if (!Array.isArray(payload)) {
      throw new Error('ARRAY_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (payload.length) {
      if (
        !payload[0].id ||
        !payload[0].username ||
        !payload[0].date ||
        !payload[0].content ||
        payload[0].is_delete === undefined
      ) {
        throw new Error('ARRAY_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (
        typeof payload[0].id !== 'string' ||
        typeof payload[0].username !== 'string' ||
        typeof payload[0].date !== 'string' ||
        typeof payload[0].content !== 'string' ||
        typeof payload[0].is_delete !== 'boolean'
      ) {
        throw new Error('ARRAY_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }

  _softDeleteContent(payload) {
    payload.map((reply) => {
      if (reply.is_delete) {
        reply.content = '**balasan telah dihapus**';
      }
      delete reply.is_delete;
    });

    return payload;
  }
}

module.exports = ArrayReplies;
