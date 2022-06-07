function hideSelf() {
    const button = document.querySelector('button')
    button.addEventListener('click', () => {
        button.hidden = !button.hidden
    }, {'once': true})
}
