function makeFriendsList(friends) {
    const friendsList = document.createElement('ul')
    friends.map(friend => {
        const point = document.createElement('li')
        point.innerHTML = `${friend.firstName} ${friend.lastName}`
        friendsList.append(point)
    })
    return friendsList
}
