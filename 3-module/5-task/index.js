function getMinMax(str) {
    const arr = str.replace(/,/g,' ')
        .split(/\s{1,}/g)
        .map(item => Number(item))
        .filter(item => !isNaN(item))
    return {max: Math.max(...arr) , min:  Math.min(...arr)}
}
