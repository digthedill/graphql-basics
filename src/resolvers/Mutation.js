import {
    v4 as uuidv4
} from "uuid"

// -Enum
//  A special type that defines a set of constants
// This type can then be used as the type for a field (similar to scalar types and object types)
// Values for the field must be one of the constants for the type


const Mutation = {
    createUser(parent, args, {
        db
    }, info) {
        const emailTaken = db.users.some(
            (user) => user.email.toLowerCase() === args.data.email.toLowerCase()
        )
        if (emailTaken) {
            throw new Error("Email already in use.")
        }
        const user = {
            id: uuidv4(),
            ...args.data
        }


        db.users.push(user)
        return user
    },
    deleteUser(parent, args, {
        db
    }, info) {
        const userIndex = db.users.findIndex(user => {
            return user.id === args.id

        })
        if (userIndex === -1) {
            throw new Error('User not found!')
        }
        //delete user, posts, and comments
        const deletedUser = db.users.splice(userIndex, 1)
        db.posts = db.posts.filter(post => {
            const match = post.author === args.id
            if (match) {
                db.comments = db.comments.filter(comment => {
                    return comment.post !== post.id
                })
            }
            return !match
        })
        db.comments = db.comments.filter(comment => comment.author !== args.id)
        return deletedUser[0]
    },
    updateUser(parent, args, {
        db
    }, info) {
        const {
            id,
            data
        } = args
        let user = db.users.find(user => id === user.id)
        if (!user) {
            throw new Error("Can't update without a real user!")
        }
        if (typeof data.email === "string") {
            const emailTaken = db.users.some(user => user.email === data.email)
            if (emailTaken) {
                throw new Error("Email taken!")
            }

            user.email = data.email
        }
        if (typeof data.name === 'string') {
            user.name = data.name
        }
        if (typeof data.username !== 'undefined') {
            user.username = data.username
        }
        return user
    },
    createPost(parent, args, {
        db,
        pubsub
    }, info) {
        // author id matches user.id
        const validUser = db.users.some((user) => user.id === args.data.author)
        if (!validUser) {
            throw new Error("User is not valid!")
        }
        const post = {
            id: uuidv4(),
            ...args.data
        }
        db.posts.push(post)
        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }
        return post
    },
    deletePost(parent, args, {
        db,
        pubsub
    }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id)
        if (postIndex === -1) {
            throw new Error("Can't find your post!")
        }
        const [post] = db.posts.splice(postIndex, 1)
        db.comments = db.comments.filter(comment => comment.post !== args.id)

        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }

        return post
    },
    updatePost(parent, args, {
        db,
        pubsub
    }, info) {
        const {
            id,
            data
        } = args
        const post = db.posts.find((post) => post.id === id)
        const originalPost = {
            ...post
        }

        if (!post) {
            throw new Error("Post not found!")
        }

        if (typeof data.body === 'string') {
            post.body = data.body

        }
        if (typeof data.title === 'string') {
            post.title = data.title

        }
        if (typeof data.published === 'boolean') {
            post.published = data.published

            if (originalPost.published && !post.published) {
                //deleted
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) {
                //created
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }

        }

        if (post.published) {
            //updated
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, {
        db,
        pubsub
    }, info) {
        const validUser = db.users.some((user) => user.id === args.data.author)
        //   search through array of post and determine if args.data.post is published
        const publishedPost = db.posts.some((post) => {
            if (post.id === args.data.post) {
                return post.published
            }
            return false
        })
        if (!validUser) {
            throw new Error("User is not valid!")
        }
        if (!publishedPost) {
            throw new Error("Post is not published!")
        }
        const comment = {
            id: uuidv4(),
            ...args.data
        }
        db.comments.push(comment)
        pubsub.publish(`comment: ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })
        return comment
    },
    deleteComment(parent, args, {
        db,
        pubsub
    }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id)
        if (commentIndex === -1) {
            throw new Error("Can't find your comment pal")
        }
        const [deletedComment] = db.comments.splice(commentIndex, 1)
        pubsub.publish(`comment: ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })

        return deletedComment
    },
    updateComment(parent, args, {
        db,
        pubsub
    }, info) {
        const {
            data,
            id
        } = args
        let comment = db.comments.find(comment => comment.id === id)
        if (typeof data.text === 'string') {
            comment.text = data.text
            pubsub.publish(`comment: ${comment.post}`, {
                comment: {
                    mutation: 'UPDATED',
                    data: comment
                }
            })
        }
        return comment
    }
}

export {
    Mutation as
    default
}