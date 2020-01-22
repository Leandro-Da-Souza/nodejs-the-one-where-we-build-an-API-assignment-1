// let id = 0;
// function idGen(id) {
//     id++;
//     return id;
// }

// module.exports = { idGen(id) };

let id = (function(n) {
    return function() {
        n += 1;
        return n;
    };
})(0);

module.exports = { id };
