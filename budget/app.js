/*
Budget controller module
closure
IIFE
*/
let budgetController = (function() {
    
    let x = 23;   // private

    function add(num) {   // private
        return num + x;
    }

    // Only publicTest function can access the private variable x and function add.
    // Nobody can change the variable x and function add, thus it is private and protected or encry.
    // API: people can use publicTest thus using variable x and function add, but can't change them,
    // therefore, variable x and function add is read-only.
    return {
        publicTest: function(num) {   // public
            return add(num);
        }
    }
})();

/*
UI controller module
*/
let UIController = (function() {

})()

/*
Controller module
Connects budget controller module and UI controller module
*/
let controller = (function(budgetCtrl, UICtrl) {
    let res = budgetCtrl.publicTest(50);
    return {
        anotherTest: function() {
            console.log(res);
        }
    }
})(budgetController, UIController)