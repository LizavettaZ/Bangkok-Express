/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
    constructor(rows) {
        this.rows = rows
        this.elem = this._table
    }

    _createTableTemplate() {
        return `
            <thead>
                <tr>
                    <th>Имя</th>
                    <th>Возраст</th>
                    <th>Зарплата</th>
                    <th>Город</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `
    }

    _createRowTemplate(arr) {
        return `
            <td>${arr.name}</td> 
            <td>${arr.age}</td> 
            <td>${arr.salary}</td> 
            <td>${arr.city}</td> 
            <td><button>X</button></td>
        `
    }

    _deleteRowOnClick = (event) => {
        const target = event.target.closest('button')
        if (target) target.closest('tr').remove()
    }

    get _table() {
        const table = document.createElement('table')
        table.insertAdjacentHTML('beforeend', this._createTableTemplate())
        const tbody = table.querySelector('tbody')

        this.rows.forEach(row => {
            tbody.insertAdjacentHTML('beforeend', this._createRowTemplate(row))
        })

        table.addEventListener('click', this._deleteRowOnClick)

        return table
    }
}
