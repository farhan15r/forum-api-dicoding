const LikeRepository = require('../../Domains/likes/LikeRepossitory');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async countLike(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM likes_comment WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return parseInt(result.rows[0].count);
  }

  async checkIsLiked(commentId, owner) {
    const query = {
      text: 'SELECT * FROM likes_comment WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    return result.rows.length;
  }

  async addLike(commentId, owner) {
    const query = {
      text: 'INSERT INTO likes_comment(comment_id, owner) VALUES($1, $2)',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async deleteLike(commentId, owner) {
    const query = {
      text: 'DELETE FROM likes_comment WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }
}

module.exports = LikeRepositoryPostgres;
