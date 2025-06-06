function addSquare() {
    const container = document.getElementById('container');
    const square = document.createElement('div');
    square.classList.add('square');
    square.addEventListener('click', changeC);
    container.appendChild(square);
}

function changeC(event) {
    event.stopPropagation();
    const rC = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    event.target.style.backgroundColor = rC;
}

document.getElementById('container').addEventListener('click', function () {
    console.log('нажатие');
});