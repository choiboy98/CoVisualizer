/*
 * You generally want to .gitignore this file to prevent important credentials from being stored on your public repo.
 */
module.exports = {
    token : "secret-starter-mern",
    mongo_connection : 'mongodb://127.0.0.1:27017/tags'
    // mongodb+srv://user:blah1780@mp3-yylzd.mongodb.net/test?retryWrites=true&w=majority
    //example: mongo_connection : "mongodb+srv://[type-yours]:[type-yours]@[type-yours-web-provided].mongodb.net/test?retryWrites=true"
};