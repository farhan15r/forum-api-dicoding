class ArrayComments {
  constructor(payload) {
    this._verifyPayload(payload);

    this.comments = payload;
  }

  _verifyPayload(payload) {
    if (!Array.isArray(payload)) {
      throw new Error('ARRAY_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (payload.length) {
      if (
        !payload[0].id ||
        !payload[0].username ||
        !payload[0].date ||
        !payload[0].content ||
        !payload[0].replies
      ) {
        throw new Error('ARRAY_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (
        typeof payload[0].id !== 'string' ||
        typeof payload[0].username !== 'string' ||
        typeof payload[0].date !== 'string' ||
        typeof payload[0].content !== 'string' ||
        Array.isArray(payload[0].replies) !== true
      ) {
        throw new Error('ARRAY_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
}

module.exports = ArrayComments;
