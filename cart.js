module.exports = function cart(oldCart) {
    if (!oldCart.items) {
      this.items = {};
      this.totalQty = 0;
      this.totalPrice = 0;
    } else {
      this.items = oldCart.items;
      this.totalQty = oldCart.totalQty;
      this.totalPrice = oldCart.totalPrice;
    }

  this.add = function(item, id) {
    let newItem = this.items[id];
    if (!newItem) {
      newItem = this.items[id] = {item: item, qty: 0, price: 0};
    }
    newItem.qty++;
    this.totalQty++;
    newItem.price = newItem.item[0].price * newItem.qty;
    this.totalPrice += newItem.item[0].price;
  }

};
