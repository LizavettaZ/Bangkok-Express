function showSalary(users, age) {
    return users.map(item => item.age <= age ? `${item.name}, ${item.balance}\n` : null)
        .join('').slice(0,-1)
}

