const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

// let getRequest = (url, cb) => {
//     let xhr = new XMLHttpRequest();
//     // window.ActiveXObject -> xhr = new ActiveXObject()
//     xhr.open("GET", url, true);
//     xhr.onreadystatechange = () => {
//         if(xhr.readyState === 4){
//             if(xhr.status !== 200){
//                 console.log('Error');
//             } else {
//                 cb(xhr.responseText);
//             }
//         }
//     };
//     xhr.send();
// };

class List {
    constructor(container, url, list = list2) {
        this.container = container;
        this.url = url;
        this.list = list;
        this.goods = [];
        this.allProducts = [];
        this._init();
    }
    getJson(url) {
        return fetch(url ? url : `${API + this.url}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });

    }
    analysisData(data) {
        this.goods = [...data];
        this.render();
    }

    getSum() {
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }

    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new this.list[this.constructor.name](product);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }
    _init() {
        return false;
    }
}

class Item {
    constructor(el, img = 'https://via.placeholder.com/200x150') {
        this.product_name = el.product_name;
        this.price = el.price;
        this.id_product = el.id_product;
        this.img = img;
    }
    render() {
        return `<div class="product_item" data-id="${this.id_product}">
                <img src="${this.img}" alt="product_photo">
                <div class="info">
                    <h3>${this.product_name}</h3>
                    <p>${this.price} $</p>
                    <button class="buy-btn"
                    data-id="${this.id_product}"
                    data-name="${this.product_name}"
                    data-price="${this.price}">Купить</button>
                </div>
            </div>`
    }
}

class ProductsList extends List {
    constructor(cart, container = '.products', url = 'catalogData.json') {
        super(container, url);
        this.cart = cart;
        this.getJson()
            .then(data => this.analysisData(data));
    }
    _init() {
        document.querySelector(this.container).addEventListener('click', el => {
            if (el.target.classList.contains('buy-btn')) {
                this.cart.addToBasket(el.target);
            }
        });
    }
}

class ProductItem extends Item {}

class Basket extends List {
    constructor(container = '.basket', url = 'getBasket.json') {
        super(container, url);
        this.getJson()
            .then(data => {
                this.analysisData(data.contents);
            });
    }
    addToBasket(el) {
        this.getJson(`${API}addToBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +el.dataset['id'];
                    let define = this.allProducts.find(product => product.id_product === productId);
                    if (define) {
                        define.quantity++;
                        this._updateBasket(define);
                    } else {
                        let product = {
                            id_product: productId,
                            price: +el.dataset['price'],
                            product_name: el.dataset['name'],
                            quantity: 1
                        };
                        this.goods = [product];
                        this.render();
                    }
                } else {
                    alert('Error');
                }
            });
    }
    delFromBasket(el) {
        this.getJson(`${API}deleteFromBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +el.dataset['id'];
                    let define = this.allProducts.find(product => product.id_product === productId);
                    if (define.quantity > 1) {
                        define.quantity--;
                        this._updateBasket(define);
                    } else {
                        this.allProducts.splice(this.allProducts.indexOf(define), 1);
                        document.querySelector(`.basket_item[data-id="${productId}"]`).remove();
                    }
                } else {
                    alert('Error');
                }
            });
    }
    _updateBasket(product) {
        let info = document.querySelector(`.basket_item[data-id="${product.id_product}"]`);
        info.querySelector('.product_quantity').textContent = `Количество товара: ${product.quantity}`;
        info.querySelector('.product_price').textContent = `$${product.quantity*product.price}`;
    }

    _init() {
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');
        });
        document.querySelector(this.container).addEventListener('click', el => {
            if (el.target.classList.contains('del_btn')) {
                this.delFromBasket(el.target);
            }
        })
    }
}

class BasketItem extends Item {
    constructor(el, img = '') {
        super(el, img);
        this.quantity = el.quantity;
    }
    render() {
        return `<div class="basket_item" data-id="${this.id_product}">
            <div class="product">
            <img src="${this.img}" alt="product_photo">
            <div class="product_info">
            <p class="product_title">${this.product_name}</p>
            <p class="product_quantity">Количество товара: ${this.quantity}</p>
        <p class="product_total_price">Цена за шт.: $${this.price}</p>
        </div>
        </div>
        <div class="sum_block">
            <p class="product_price">$${this.quantity*this.price}</p>
            <button class="del_btn" data-id="${this.id_product }">&times;</button>
        </div>
        </div>`
    }
}

const list2 = {
    ProductsList: ProductItem,
    Basket: BasketItem
};

let basket = new Basket();
let products = new ProductsList(basket);
products.getJson('getProducts.json')
    .then(data => products.analysisData(data));