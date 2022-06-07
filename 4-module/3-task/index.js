function highlight(table) {
    const tBody = table.querySelector('tbody')

    for (let row of tBody.rows) {
        +row.cells[1].innerHTML < 18 ? row.style.textDecoration = 'line-through' : null
        row.cells[2].innerHTML === 'm' ? row.classList.add('male') :  row.classList.add('female')
        if (row.cells[3].dataset.available === 'true'){
            row.classList.add('available')
        } else if (row.cells[3].dataset.available === 'false'){
            row.classList.add('unavailable')
        } else {
            row.setAttribute('hidden', 'true')
        }
    }
}
