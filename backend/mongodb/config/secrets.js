/*
 * You generally want to .gitignore this file to prevent important credentials from being stored on your public repo.
 */
module.exports = {
    token : "secret-starter-mern",
    mongo_connection : 'mongodb+srv://thomasy4:cs411@covisualizer.yylzd.mongodb.net/tags?retryWrites=true&w=majority'
    // mongodb+srv://user:blah1780@mp3-yylzd.mongodb.net/test?retryWrites=true&w=majority
    //example: mongo_connection : "mongodb+srv://[type-yours]:[type-yours]@[type-yours-web-provided].mongodb.net/test?retryWrites=true"
};