/*
 * Connect all of your endpoints together here.
 */
const tags = require('./tags.js');


module.exports = (app, router) => {
    app.use('/api', require('./home.js')(router));
    app.post('/api/tags', tags.postTag)
    // app.post('/api/users', users.postUser);
    // app.post('/api/tasks', tasks.postTask);
    // app.get('/api/users', users.getUsers);
    // app.get('/api/tasks', tasks.getTasks);

    // app.get('/api/users/:id', users.getUserGivenId);
    // app.get('/api/tasks/:id', tasks.getTaskGivenId);
    // app.delete('/api/users/:id', users.deleteUserGivenId);
    // app.delete('/api/tasks/:id', tasks.deleteTaskGivenId);
    // app.put('/api/users/:id', users.updateUserGivenId);
    // app.put('/api/tasks/:id', tasks.updateTaskGivenId);

};


