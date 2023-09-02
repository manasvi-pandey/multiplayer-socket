function renderRooms(roomList) {
    let roomsTableRow = "";
    if (roomList.length > 0) {
        roomList.forEach(room => {
            roomsTableRow += `<tr>
                                <td>${room[0]}</td>
                                <td>${room[1]}</td>
                                <td><button class="btn btn-xs btn-primary" disabled>Join room</button></td>
                            </tr>`;
        })
    } else {
        roomsTableRow =
            "<tr><td colspan='3' class='text-center'>No rooms found</td></tr>";
    }

    $("#roomsTableBody").html(roomsTableRow);
}

function renderUsers(userList) {
    let usersListItem = "";
    if (userList.length > 0) {
        userList.forEach(user => {
            usersListItem += `<li style="padding: 5px">${user[1]}</li>`;
        })
    } else {
        usersListItem =
            "<li style='padding: 5px'>No one's here</li>";
    }

    $("#userList").html(usersListItem);
}