const RepliesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threadCommentReplies',
  register: async (server, { container }) => {
    const repliesHandler = new RepliesHandler(container);
    server.route(routes(repliesHandler));
  },
};
