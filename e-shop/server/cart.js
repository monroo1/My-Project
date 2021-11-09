const e = require("express");

let add = (cart, req) => {
    cart.contents.push(req.body);
    cart.countGoods += req.body.quantity;
    cart.amount += req.body.price;
    return JSON.stringify(cart, null, 4);
};
let change = (cart, req) => {
    let find = cart.contents.find(el => el.id_product === +req.params.id);
    find.quantity += req.body.quantity;
    cart.countGoods += req.body.quantity;
    cart.amount += req.body.price;
    return JSON.stringify(cart, null, 4);
};
let remove = (cart, req) => {
    let find = cart.contents.find(el => +el.id_product === req.body.id_product);
    let cartContent = cart.contents;
    cartContent.splice(cartContent.indexOf(find), 1);
    cart.countGoods -= req.body.quantity;
    cart.amount -= req.body.price;
    return JSON.stringify(cart, null, 4);
};
module.exports = {
    add,
    change,
    remove
};