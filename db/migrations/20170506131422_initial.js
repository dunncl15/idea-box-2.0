
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folders', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('ideas', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.text('body');
      table.integer('folder_id').unsigned();
      table.foreign('folder_id')
           .references('folders.id');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('ideas'),
    knex.schema.dropTable('folders'),
  ])
};
