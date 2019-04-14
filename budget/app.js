/*
Budget controller module
closure
IIFE
*/
let budgetController = (function() {
    
    // let x = 23;   // private

    // function add(num) {   // private
    //     return num + x;
    // }

    // // Only publicTest function can access the private variable x and function add.
    // // Nobody can change the variable x and function add, thus it is private and protected or encry.
    // // API: people can use publicTest thus using variable x and function add, but can't change them,
    // // therefore, variable x and function add is read-only.
    // return {
    //     publicTest: function(num) {   // public
    //         return add(num);
    //     }
    // }

    // create expense and income class
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    // data structure to store all exp and inc items
    // store total inc, total exp, budget
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {   // create public API

        // create instance of object
        // new Expense(id, description, value);
        addItem(type, des, val) {
            let newItem;
            // create id for new items
            // [1, 2, 3] -> 4
            // [1, 5, 8] -> 9
            // the last objects' id plus one
            let itemList = data.allItems[type];
            let ID = itemList.length === 0 ? 0 : itemList[itemList.length - 1].id + 1;

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBudget(type, val) {
            data.total[type] += val;
            data.budget = data.total.inc - data.total.exp;
            data.percent = Math.round((data.total.exp / data.total.inc) * 100);
            return [data.budget, data.total.inc, data.total.exp, data.percent];
        }
    }
    

})();

/*
UI controller module
*/
let UIController = (function() {

    const DOMString = {   // store those class name in one place, for easier maintainance;
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        inc: '.budget__income--value',
        exp: '.budget__expenses--value',
        budget: '.budget__value',
        percentage: '.budget__expenses--percentage'
    };

    return {
        getInput() {   // get all the user input
            return {
                type: document.querySelector(DOMString.inputType).value,   // will be either inc or exp
                description: document.querySelector(DOMString.inputDescription).value,
                value: parseFloat(document.querySelector(DOMString.inputValue).value)
            };
        },

        addListItem(obj, type) {
            let html, newHtml, element;
            // add big chunck of html in js
            if (type === 'exp') {
                element = DOMString.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'inc') {
                element = DOMString.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }   
            // replace parts of string
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert chunck of html into html
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields() {
            let fields = document.querySelectorAll(DOMString.inputDescription + ', ' + DOMString.inputValue);
            let fieldsArr = [...fields];
            fieldsArr.forEach(ele => ele.value = '');
            fieldsArr[0].focus();
        },

        updateUI(inc, exp, budget, percentage) {
            document.querySelector(DOMString.inc).textContent = inc;
            document.querySelector(DOMString.exp).textContent = exp;
            document.querySelector(DOMString.budget).textContent = budget;
            document.querySelector(DOMString.percentage).textContent = percentage;
        },

        getDOMString() {   // expose DOMString object to the public
            return DOMString;
        }
    }
})()

/*
App controller module
Connects budget controller module and UI controller module
*/
let controller = (function(budgetCtrl, UICtrl) {

    function setUpEventListeners() {   // make the code cleaner
        const DOM = UIController.getDOMString();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 32 || e.which === 32) {   // some old browser uses e.which to refer the keycode
                ctrlAddItem();
            }
        })
    }

    function updateBudget(input) {
        // 4. update budget value;
        let res = budgetController.calculateBudget(input.type, input.value);
        let [budget, inc, exp, percentage] = [...res];
        // 5. display new budget to ui;
        UIController.updateUI(inc, exp, budget, percentage);
    }

    function ctrlAddItem() {
        // 1. get input option, item and value;
        let input = UICtrl.getInput();
        if (input.description !== '' && input.value > 0) {
            // 2. add item to budget controller;
            let newItem = budgetController.addItem(input.type, input.description, input.value);
            // 3. add item to ui;
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget(input);
        }
    }

    return {
        init() {
            console.log('set up successfully');
            setUpEventListeners();
        }
    }
    
})(budgetController, UIController)

controller.init();