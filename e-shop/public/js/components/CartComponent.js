// const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

Vue.component('cart', {
    data(){
      return {
          cartUrl: '/getBasket.json',
          countProducts: null,
          amountProducts: null,
          cartItems: [],
          showCart: false
      }
    },
    mounted(){
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let item of data.contents){
                    this.$data.cartItems.push(item);
                }
                this.$data.amountProducts = data.amount;
                this.$data.countProducts = data.countGoods;
            })
    },
    methods: {
        addProduct(product){
            let find = this.cartItems.find(el => el.id_product === product.id_product);
            if(find){
                this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1, price: find.price})
                    .then(data => {
                        if(data.result === 1){
                            find.quantity++;
                            this.countProducts++;
                            this.amountProducts+=product.price;
                        }
                    })
                    
            } else {
                const prod = Object.assign({quantity: 1}, product);
                this.$parent.postJson(`/api/cart`, prod)
                    .then(data => {
                        if(data.result === 1){
                            this.cartItems.push(prod);
                            this.countProducts++;
                            this.amountProducts+=product.price;
                        }
                    })
            }
        },
        remove(product){
            if(product.quantity > 1){
                this.$parent.putJson(`/api/cart/${product.id_product}`, {quantity: -1, price: -product.price})
                .then(data => {
                    if(data.result){
                        product.quantity--;
                        this.amountProducts-=product.price;
                        this.countProducts--;
                    }
                })
            } else {
                this.$parent.delJson(`/api/cart/${product.id_product}`, product)
                .then(data => {
                    if(data.result){
                        this.cartItems.splice(this.cartItems.indexOf(product), 1);
                        this.amountProducts-=product.price;
                        this.countProducts--;
                    } else {
                        console.log("error")
                    }
                })
                
            }
        }
    },
    template: `<div>
<button class="btn-cart" type="button" @click="showCart = !showCart">Корзина</button>
        <div class="cart-block" v-show="showCart">
            <p v-if="!cartItems.length">Корзина пуста.</p>
            <div v-else class="products-list">
                <cart-item v-for="item of cartItems" :key="item.id_product" :cart-item="item" @remove="remove">
                </cart-item>
                <hr>
                <p>Общее колличество: {{ countProducts }} шт.</p>
                <p>Общая стоимость: {{ amountProducts }} ₽</p>
            </div>
        </div>
        </div>
    `
});

Vue.component('cart-item', {
    props: ['img', 'cartItem'],
    template: `
    <div class="cart-item">
                    <div class="product-bio">
                        <img :src="cartItem.img" alt="Some img">
                        <div class="product-desc">
                            <div class="product-title">{{ cartItem.product_name }}</div>
                            <div class="product-quantity">Колличество: {{ cartItem.quantity }}</div>
                            <div class="product-single-price">₽ {{ cartItem.price }} за ед.</div>
                        </div>
                    </div>
                    <div class="right-block">
                        <div class="product-price">{{cartItem.quantity*cartItem.price}} ₽</div>
                        <button class="del-btn" @click="$emit('remove', cartItem)">&times;</button>
                    </div>
                </div>
    `
})