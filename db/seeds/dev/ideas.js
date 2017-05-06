
exports.seed = function(knex, Promise) {
  return knex('ideas').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert({
          title: 'Home Improvements'
        }, 'id')
        .then(folder => {
          return knex('ideas').insert([
            { title: 'Replace fence',
              body: 'Get estimate to replace leaning fence on east side of the house. Also look into property line to extend fence beyond garage to create enclosed garbage area.',
              folder_id: folder[0]
            }
          ])
        })
      ])
    });
};
