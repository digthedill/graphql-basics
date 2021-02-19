const Query = {
    users(parent, args, {
        db
    }, info) {
        if (!args.query) {
            return db.users
        }

        return db.users.filter((user) =>
            user.name.toLowerCase().includes(args.query.toLowerCase())
        )
    },
    posts(parent, args, {
        db
    }, info) {
        if (!args.query) {
            return db.posts
        }
        return db.posts.filter(
            (post) =>
            post.title.toLowerCase().includes(args.query.toLowerCase()) ||
            post.body.toLowerCase().includes(args.query.toLowerCase())
        )
    },
    comments(parent, args, {
        db
    }, info) {
        return db.comments
    },

    me() {
        return {
            email: "dilldog@gmail.com",
            name: "Dillon",
            id: 199,
            username: "hornyman",
        }
    },
    post() {
        return {
            id: 12389,
            body: "All I want is to learn everything the world has available for me!",
            title: "First blog!",
            published: false,
        }
    },
}
export {
    Query as
    default
}