// istanbul ignore file
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'sebuah comment',
    threadId = 'thread-123',
    date = new Date().toISOString(),
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comments (id, content, thread_id, date, owner) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, threadId, date, owner],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentTableTestHelper;
