/*
 * Connect all of your endpoints together here.
 */
const tags = require('./tags.js');


module.exports = (app, router) => {
    app.use('/api', require('./home.js')(router));
    app.post('/api/tags', tags.postTag);

    app.get('/api/tags/:id', tags.getTagGivenId);
    app.get('/api/tags', tags.getTag);

    app.delete('/api/tags/:id', tags.deleteTagGivenId);
    app.delete('/api/tags', tags.deleteTag);

    app.put('/api/tags/:id', tags.updateTagGivenId);
};


