// Storage Controller


// Item Controller 
const ItemController = (function () {
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: [{
                id: 1,
                name: 'Steve Doe',
                calories: 1400
            },
            {
                id: 3,
                name: 'John Doe',
                calories: 1400
            }
        ],
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            // generate id
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // calories to int
            calories = parseInt(calories);

            // createNew Items
            newItem = new Item(ID, name, calories);
            // add to item array
            data.items.push(newItem);
        },
        logData: function () {
            return data;
        }
    }

})();


// UI Controller 
const UIController = (function () {

    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemName: '#item-name',
        itemCalories: '#item-calories',
    }

    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}"><strong> ${item.name} </strong>
                <em>${item.calories}</em>
                <a href="#" class="secondary-content"><i class="fas fa-pencil-alt"></i></a></li>`
            });
            const ul = document.querySelector(UISelectors.itemList);
            ul.innerHTML = html;
        },
        // get Item 
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemName).value,
                calories: document.querySelector(UISelectors.itemCalories).value
            }
        },
        // Get selectors
        getSelectors: function () {
            return UISelectors;
        }
    }

})();


// App Controller 
const App = (function (ItemController, UIController) {

    // Event Listeners 
    const loadEventListeners = function () {
        const UISelectors = UIController.getSelectors();

        // Add Item  
        document.querySelector(UISelectors.addBtn).addEventListener('click', addItem)

    }

    // add item function 
    function addItem(e) {
        // Get item form UI controller 
        const input = UIController.getItemInput();

        // validation 
        if (input.name !== '' && input.calories !== '') {
            // Add Item
            const newItem = ItemController.addItem(input.name, input.calories)

        }

        e.preventDefault();

    }


    return {
        init: function () {
            console.log('Initializing App...');
            const items = ItemController.getItems();
            // Send Items to UI 
            UIController.populateItemList(items);

            // Load event Listeners 
            loadEventListeners();
        }
    }
})(ItemController, UIController);

// Initialize App
App.init();