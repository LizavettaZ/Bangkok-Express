function sumSalary(salaries) {
    let sum = 0
    for (const item in salaries) {
        if (typeof salaries[item] === 'number' && isFinite(salaries[item])) {
            sum += salaries[item]
        } else if (salaries == null) {
            sum = 0
        }
    }
    return sum
}
