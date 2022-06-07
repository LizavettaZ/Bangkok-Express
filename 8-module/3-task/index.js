export default class Cart {
    cartItems = [] // [product: {...}, count: N]

    constructor(cartIcon) {
        this.cartIcon = cartIcon
    }

    //Добавление товара в массив
    addProduct(product) {
        if (!product) return
        const noProduct = this.cartItems.every(cartItem => cartItem.product.name !== product.name)

        if (noProduct) {
            this.cartItems.push({ product, count: 1 })
            this.onProductUpdate({ product, count: 1 })
        } else {
            this.cartItems.forEach(cartItem => {
                if (cartItem.product.name === product.name) {
                    cartItem.count++
                    this.onProductUpdate(cartItem)
                }
            })
        }
    }

    //Изменение количества товара
    updateProductCount(productId, amount) {
        this.cartItems.forEach((cartItem, index) => {
            if (cartItem.product.id === productId) {
                cartItem.count += amount

                if (cartItem.count === 0) {
                    this.cartItems.splice(index, 1)
                }
            }
        })
    }

    //Пустой ли массив
    isEmpty() {
        return !this.cartItems.length
    }

    //Общее количество товаров в массиве
    getTotalCount() {
        return this.cartItems.reduce((sum, item) => sum + item.count, 0)
    }

    //Общая сумма товаров в массиве
    getTotalPrice() {
        return this.cartItems.reduce((sum, item) => sum + item.count * item.product.price, 0)
    }

    onProductUpdate(cartItem) {
      // реализуем в следующей задаче
        this.cartIcon.update(this)
    }
}

