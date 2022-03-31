console.log("start testing ..")

let prom = new Promise(function (seller) {
    console.log(seller);
    return 56;
});

prom.then(result => console.log(result));

console.log("rrr");