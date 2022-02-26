
function init() {
    setInterval(cursor, 500)
}

function cursor() {
    let c = document.querySelector('#cursor')
    c.style.opacity == '0' ?
        c.style.opacity = '1' : c.style.opacity = '0'
}