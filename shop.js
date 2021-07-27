// all products
class Products {
  constructor() {
    // products data
    this.products = [
      {
        id: 1,
        name: "Pilot Avator Glasses",
        price: "45.00",
        imageUrl: "./img/glasses.png"
      },
      {
        id: 2,
        name: "Command Hats",
        price: "15.00",
        imageUrl: "./img/hats.png"
      },
      {
        id: 3,
        name: "Mission T-Shirts",
        price: "25.00",
        imageUrl: "./img/shirts.png"
      }
    ];
    // dom products container
    this.storeContainer = document.querySelector(".store__content-center");
  }
  // display products to the UI
  renderProducts() {
    this.products.forEach(product => {
      const productEl = document.createElement("div");
      productEl.className = "store__item";
      productEl.id = `prod-${product.id}`;
      productEl.innerHTML = `
        <div class="store__item-img">
          <img src=${product.imageUrl} alt=${product.name}>
        </div>
        <p class="store__item-name">
          ${product.name}
        </p>
        <p class="store__item-price">
          $${product.price}
        </p>
        <button class="store__item-cart-btn" type="button" data-id="prod-${product.id}">
          Add to Cart
        </button>
        <p class="store__item-added__alert">
          Item added to the Cart
        </p>
      `;
      this.storeContainer.insertAdjacentElement("beforeend", productEl);
    });
  }
  displayItemAddedAlert(itemId) {
    // find clicked item by passed itemId
    let itemAdded = this.storeContainer.querySelector(`#prod-${itemId}`);
    // display alert
    itemAdded.querySelector(".store__item-added__alert").style.display = "block";
    // hide alert eventually
    setTimeout(() => {
      itemAdded.querySelector(".store__item-added__alert").style.display = "none";
    }, 1500);
  }
}

// Cart
class Cart {
  constructor() {
    // ...to be populated as item is added to the cart
    this.cartItems = [];
    // dom stuff
    this.cartItemsQty = document.querySelector(".cart-icon__amount");
    this.cartItemsTotalPrice = document.querySelector(".cart__box-total__price");
    this.cartItemsContainer = document.querySelector(".cart__box-items");
    this.cartIcon = document.querySelector(".cart-icon__img");
    this.cartBox = document.querySelector(".cart__box");
    // item removed from cart alert
    this.itemRemovedAlert = document.querySelector(".cart__box-remove-alert");
    // cart emptied msg
    this.allItemsRemovedMsg = document.querySelector(".cart__box-empty__msg");
  }
  // add product to cart if it doesn't exist there
  addNewProductToCart(productsInstance, targetId) {
    // find product form product list that matches clicked id
    let clickedProduct = productsInstance.products.find(prod => prod.id === targetId);
    // set quantity for product
    clickedProduct.qty = 1;
    // add to cart
    this.cartItems.push(clickedProduct);
  }
  // main add-product-to-cart method
  addProductToCart(productsInstance, targetId) {
    // always increment total quantity
    this.cartItemsQty.textContent = parseInt(this.cartItemsQty.textContent) + 1;

    if(this.cartItems.length === 0) {
      this.addNewProductToCart(productsInstance, targetId);
    } else {
      // check if clicked product matches with existing ones in cart
      let clickedProduct = this.cartItems.find(prod => prod.id === targetId);

      if(!clickedProduct) {
        this.addNewProductToCart(productsInstance, targetId);
      } else {
        // if product exists just add to the 'qty' property
        let existingProductIndex = this.cartItems.indexOf(clickedProduct);
        let updatedCart = [...this.cartItems];
        updatedCart[existingProductIndex].qty = updatedCart[existingProductIndex].qty + 1;
        this.cartItems = updatedCart;
      }
    }
    // re-render cart UI after every item/qty added
    this.addCartProductsToUI();
  }
  addCartProductsToUI() {
    if(this.cartItems.length > 0) {
      // clear container to avoid duplicate values
      this.cartItemsContainer.innerHTML = "";
      // loop through cart items to display them 
      this.cartItems.forEach(item => {
        const itemEl = document.createElement("div");
        itemEl.className = "cart__box-item";
        itemEl.id = `prod-${item.id}`;
        itemEl.innerHTML = `
          <div class="cart__box-item__top">
            <img class="cart__box-item__img" src=${item.imageUrl} alt=${item.name}>
            <button class="cart__box-item__remove" data-id="prod-${item.id}">
              Remove
            </button>
          </div>
          <div class="cart__box-item__bottom">
            <p class="cart__box-item__name">
              ${item.name}
            </p>
            <div class="cart__box-item__pricebox">
              <p class="cart__box-item__amount">(${item.qty})</p>
              <p class="cart__box-item__price">$${parseInt(item.price) * item.qty}</p>
            </div>
          </div>
        `;

        this.cartItemsContainer.insertAdjacentElement("beforeend", itemEl);
      });
    }
    this.calculateTotalCartPrice();
  }
  calculateTotalCartPrice() {
    let cartItemsPrices = this.cartItems.map(item => parseInt(item.price) * item.qty);
    
    let totalPrice = cartItemsPrices.reduce((sum, price) => {
      return sum + price;
    }, 0);
    this.cartItemsTotalPrice.textContent = "$" + totalPrice;
  }
  removeItemFromTheCart(targetId) {
    // always decrement total quantity
    this.cartItemsQty.textContent = parseInt(this.cartItemsQty.textContent) - 1;

    let clickedProduct = this.cartItems.find(item => item.id === targetId);
    let clickedProductIndex = this.cartItems.indexOf(clickedProduct);

    if(clickedProduct.qty > 1) {
      let updatedCart = [...this.cartItems];
      updatedCart[clickedProductIndex].qty = updatedCart[clickedProductIndex].qty - 1;
      this.cartItems = updatedCart;
    } else if(clickedProduct.qty <= 1) {
      this.cartItems.splice(clickedProductIndex, 1);
        console.log("vece od 1");
      this.itemRemovedAlert.style.display = "block";
      setTimeout(() => {
        this.itemRemovedAlert.style.display = "none";
      }, 1000);
    } 
    // make sure cart is empty and hidden where total qty is 0
    if(parseInt(this.cartItemsQty.textContent) === 0) {
      this.cartBox.style.display = "none";
      this.cartItems = [];

      this.allItemsRemovedMsg.style.display = "block";
      setTimeout(() => {
        this.allItemsRemovedMsg.style.display = "none";
      }, 1500);
    }
    // re-render cart UI after every item/qty removed/decremented
    this.addCartProductsToUI();
  }
}

// controller function
const controllerFn = (() => {
  // instantiate products object
  const products = new Products();
  // instantiate Cart object
  const cart = new Cart();

  // render products when doc loads
  document.addEventListener("DOMContentLoaded", () => {
    products.renderProducts();
  });

  // add to cart event
  products.storeContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("store__item-cart-btn")) {
      let targetId = parseInt(event.target.dataset.id.split("-")[1]);
      cart.addProductToCart(products, targetId);
      cart.cartBox.style.display = "none";
      products.displayItemAddedAlert(targetId);
    }
  });

  // display/hide cart
  cart.cartIcon.addEventListener("click", () => {
    if(parseInt(cart.cartItemsQty.textContent) > 0 && cart.cartBox.style.display !== "block") {
      cart.cartBox.style.display = "block";
    } else if(cart.cartBox.style.display === "block") {
      cart.cartBox.style.display = "none";
    }
  });

  // remove item from the cart
  cart.cartItemsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("cart__box-item__remove")) {
      let targetId = parseInt(event.target.dataset.id.split("-")[1]);
      cart.removeItemFromTheCart(targetId);
    }
  });
})();

