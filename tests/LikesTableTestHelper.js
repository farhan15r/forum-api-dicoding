// instanbul ignore file
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({ commentId = 'comment-123', owner = 'user-123' }) {
    const query = {
      text: 'INSERT INTO likes_comment(comment_id, owner) VALUES($1, $2)',
      values: [commentId, owner],
    };

    await pool.query(query);
  },

  async findLikesByCommentId(commentId) {
    const query = {
      text: 'SELECT * FROM likes_comment WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes_comment WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
