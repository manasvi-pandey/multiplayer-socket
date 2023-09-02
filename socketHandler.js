const { Server } = require("socket.io");

function socketHandler(server) {
    const io = new Server(server);

    let users = new Map(),
        rooms = new Map();

    io.on("connection", (socket) => {
        let randomUsername = createRandomUsername();
        users.set(socket.id, randomUsername);
        socket.emit("user:name", randomUsername);
        io.emit("user:list", Array.from(users.entries()));

        // On new client connection, send list of available rooms
        socket.emit("room:list", Array.from(rooms.entries()));

        socket.on("room:findOrCreate", (roomName) => {
            if (rooms.size > 0) {
                for (let [id, players] of rooms) {
                    if (players <= 1) {
                        socket.join(id);
                        rooms.set(id, +players + 1);
                        let username = getUsernameFromSocketID(socket.id, users);
                        console.log(`${username} has joined the room ${id}`.green);
                        io.emit("room:list", Array.from(rooms.entries()));
                        return;
                    }
                }
            }

            rooms = createAndJoinNewRoom(socket, io, rooms, roomName, users);
        });

        socket.on("room:leaveAllRooms", () => {
            rooms = leaveAllRooms(socket, io, rooms);
        });

        socket.on("user:rename", (name) => {
            users.set(socket.id, name);
            io.emit("user:list", Array.from(users.entries()));
        })

        socket.on("disconnecting", () => {
            rooms = leaveAllRooms(socket, io, rooms);
        });

        socket.on("disconnect", () => {
            let username = getUsernameFromSocketID(socket.id, users);
            // Remove from userlist
            users.delete(socket.id);
            io.emit("user:list", Array.from(users.entries()));
            console.log(
                `${username} have disconnected and is removed from all rooms`.red
            );
        });
    });
}

function createAndJoinNewRoom(socket, io, rooms, roomName, users) {
    rooms.set(roomName, 1);
    socket.join(roomName);
    let username = getUsernameFromSocketID(socket.id, users);
    console.log(`${username} has created and joined the room ${roomName}`.green);
    io.emit("room:list", Array.from(rooms.entries()));
    return rooms;
}

function leaveAllRooms(socket, io, rooms) {
    let joinedRooms = socket.rooms;
    let iteration = 1;
    joinedRooms.forEach((room) => {
        if (iteration > 1) {
            socket.leave(room);
            if (+rooms.get(room) - 1 === 0) {
                rooms.delete(room);
            } else {
                rooms.set(room, +rooms.get(room) - 1);
            }
        }

        iteration++;
    });

    io.emit("room:list", Array.from(rooms.entries()));
    return rooms;
}

function createRandomUsername() {
    const adjectives = [
        "Amazing",
        "Brilliant",
        "Creative",
        "Dazzling",
        "Energetic",
        "Fantastic",
        "Grateful",
        "Happy",
        "Innovative",
        "Joyful",
        "Kind",
        "Lovely",
        "Magnificent",
        "Neat",
        "Optimistic",
        "Playful",
        "Quick",
        "Radiant",
        "Smart",
        "Terrific",
        "Unique",
        "Vivacious",
        "Wonderful",
        "Xenodochial",
        "Youthful",
        "Zealous",
        "Adventurous",
        "Benevolent",
        "Charming",
        "Daring",
        "Eloquent",
        "Fearless",
        "Gentle",
        "Humble",
        "Intelligent",
        "Jovial",
        "Kind",
        "Lively",
        "Mellow",
        "Noble",
        "Optimistic",
        "Peaceful",
        "Quirky",
        "Resilient",
        "Sincere",
        "Thoughtful",
        "Upbeat",
        "Vibrant",
        "Witty",
        "Yummy",
    ];

    const animals = [
        "Elephant",
        "Giraffe",
        "Kangaroo",
        "Lion",
        "Tiger",
        "Panda",
        "Leopard",
        "Hippopotamus",
        "Koala",
        "Penguin",
        "Zebra",
        "Gorilla",
        "Jaguar",
        "Ostrich",
        "Octopus",
        "Rhinoceros",
        "Kookaburra",
        "Platypus",
        "Quokka",
        "Toucan",
        "Unicorn",
        "Vulture",
        "Wombat",
        "Albatross",
        "Bison",
        "Cheetah",
        "Dolphin",
        "Eagle",
        "Falcon",
        "Horse",
        "Iguana",
        "Jellyfish",
        "Llama",
        "Mantis",
        "Narwhal",
        "Orangutan",
        "Polar Bear",
        "Quail",
        "Rattlesnake",
        "Sloth",
        "Tortoise",
        "Uakari",
        "Vicuña",
        "Wolf",
        "Yak",
    ];

    const randomAdjective =
        adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return randomAdjective + " " + randomAnimal;
}

function getUsernameFromSocketID(id, users) {
    for (const [userid, username] of users.entries()) {
        if (userid === id) 
            return username;
    }
}

module.exports = socketHandler;

// let newUser = {
//     socketID: socket.id,
//     username: null
// }

// users.push(newUser);
// io.emit("update users", users);

// socket.on("disconnect", () => {
//     users = users.filter(user => (user.socketID !== socket.id));
//     io.emit("update users", users);
//     io.emit("update rooms", rooms);
// });

// socket.on("username selected", (name) => {
//     users.map(user => {
//         if (user.socketID === socket.id) {
//             user.username = name;
//         }
//         return user;
//     })

//     io.emit("update users", users);
// })

// socket.on("random room", (room) => {
//     let roomObj = {
//         id: room,
//         userCount: 1
//     }
//     rooms.push(roomObj);
//     socket.join(room);
//     io.emit("update rooms", rooms);
//     console.log(`${socket.id} joined the room ${room}`);
// })

// socket.on("join room", (room) => {
//     rooms.map(room => {
//         if (room.id === room) {
//             room.userCount = +room.userCount + 1;
//         }
//     })
//     socket.join(room);
//     console.log(`${socket.id} joined the room ${room}`);
// })
