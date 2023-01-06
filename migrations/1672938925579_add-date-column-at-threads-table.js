/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumns('threads', {
    date: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('threads', 'date');
};
