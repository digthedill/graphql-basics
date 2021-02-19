const User = {
    posts(parent, args, {
        db
    }, info) {
        return db.posts.filter((post) => post.author === parent.id)
    },
    comments(parent) {
        return db.comments.filter((comment) => comment.author === parent.id)
    },
}
export {
    User as
    default
}