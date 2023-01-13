// istanbul ignore file
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'sebuah reply',
    commentId = 'comment-123',
    date = '2020-01-12T16:36:10.653Z',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO replies (id, content, comment_id, date, owner) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, commentId, date, owner],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
