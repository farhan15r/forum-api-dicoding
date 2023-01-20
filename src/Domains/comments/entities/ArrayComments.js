class ArrayComments {
  constructor(payload) {
    this._verifyPayload(payload);

    this.comments = this._reStructureContent(payload);
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
        payload[0].like_count === undefined ||
        !payload[0].replies ||
        payload[0].is_delete === undefined
      ) {
        throw new Error('ARRAY_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (
        typeof payload[0].id !== 'string' ||
        typeof payload[0].username !== 'string' ||
        typeof payload[0].date !== 'string' ||
        typeof payload[0].content !== 'string' ||
        typeof payload[0].like_count !== 'number' ||
        Array.isArray(payload[0].replies) !== true ||
        typeof payload[0].is_delete !== 'boolean'
      ) {
        throw new Error('ARRAY_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }

  _reStructureContent(payload) {
    payload.map((comment) => {
      comment.likeCount = comment.like_count;
      if (comment.is_delete) {
        comment.content = '**komentar telah dihapus**';
      }
      delete comment.is_delete;
      delete comment.like_count;
    });

    return payload;
  }
}

module.exports = ArrayComments;
