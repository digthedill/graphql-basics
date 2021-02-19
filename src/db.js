const users = [{
        id: "1",
        name: "Dillon",
        email: "gggg@gmail.com",
    },
    {
        id: "2",
        name: "Ariel",
        email: "roooo@gosj.com",
    },
    {
        id: "3",
        name: "Roo ROo",
        email: "",
        username: "roooooo",
    },
]

const posts = [{
        id: "12",
        body: "a picture made in heaven!",
        title: "Montegumry",
        published: true,
        author: "1",
    },
    {
        id: "13",
        body: "a record made in heaven!",
        title: "Charlotte",
        published: false,
        author: "1",
    },
    {
        id: "14",
        body: "a penis made in heaven!",
        title: "Montreal",
        published: true,
        author: "2",
    },
    {
        id: "15",
        body: "a titty made in heaven!",
        title: "The Fall",
        published: false,
        author: "3",
    },
]

const comments = [{
        id: "1",
        text: "I ride a bike to the store all the time!",
        author: "1",
        post: "85634",
    },
    {
        id: "2",
        text: "The immovable object meets the unstoppable force!",
        author: "2",
        post: "85634",
    },
    {
        id: "3",
        text: "Being a man does not make you smart, trust me...",
        author: "2",
        post: "2352",
    },
]

const db = {
    users,
    posts,
    comments
}

export {
    db as
    default
}