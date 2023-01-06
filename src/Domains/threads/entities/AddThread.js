class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, owner } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload.title || !payload.body || !payload.owner) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof payload.title !== 'string' ||
      typeof payload.body !== 'string' ||
      typeof payload.owner !== 'string'
    ) {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
