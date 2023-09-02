const socket = io();
let oldName = "";

function findAMatch() {
    $("#findAMatchButton").removeClass("show").addClass("hide");
    $("#cancelSearchButton").removeClass("hide").addClass("show");
    let roomName = "rps" + Math.floor(100000 + Math.random() * 900000);
    socket.emit("room:findOrCreate", roomName);
}

function cancelSearch() {
    socket.emit("room:leaveAllRooms");
    $("#findAMatchButton").removeClass("hide").addClass("show");
    $("#cancelSearchButton").removeClass("show").addClass("hide");
}

function renameUser(ref) {
    let newName = ref.value;
    if (newName === "") {
        alert("Please enter a name");
        $("#selectUsername").val(oldName);
    } else {
        socket.emit("user:rename", newName);
    }
}

socket.on("room:list", (rooms) => {
    renderRooms(rooms);
});

socket.on("user:name", (name, users) => {
    $("#selectUsername").val(name);
    oldName = name;
});

socket.on("user:list", (users) => {
    renderUsers(users);
})
