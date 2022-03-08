"use strict"

const products = [
    {id: 1, title: 'Notebook', price: 2000},
    {id: 2, title: 'Mouse', price: 20},
    {id: 3, title: 'Keyboard', price: 200},
    {id: 4, title: 'Gamepad', price: 50},
];

const renderProduct = (item) =>
`<div class="product-item">
    <img class = "product-photo" src="${item.id}.jpg" alt="product_photo">
    <h3>${item.title}</h3>
    <p>${item.price} руб.</p>
    <button class="buy-btn">Купить</button>
</div>`;

const renderPage = list => {
    const productsList = list.map(item => renderProduct(item));
    console.log (productsList);
    document.querySelector('.products').innerHTML = productsList.join('');
};

renderPage(products);
