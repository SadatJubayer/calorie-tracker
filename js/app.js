// Storage Controller
const storageController = (function () {
    return {
        storeItem: function (item) {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items))
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items))
            }
        },
        getItemsFromStorage: function () {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items;
        },
        deleteFromLocalStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearAllFromLocalStorage: function () {
            localStorage.removeItem('items');
        },
        updateItemStorage: function (newItem) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if (newItem.id === item.id) {
                    items.splice(index, 1, newItem);

                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        }
    }
})();

// Item Controller 
const ItemController = (function () {
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: storageController.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function () {
            return data.items;
        },
        addItems: function (name, calories) {
            // generate id
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // calories to int
            calories = parseInt(calories);

            // create New Items
            newItem = new Item(ID, name, calories);
            // add to item array
            data.items.push(newItem);
            return newItem;
        },
        getItemByID: function (id) {
            let result = null;
            data.items.forEach((item) => {
                if (item.id === id) {
                    result = item;
                }
            });
            return result;
        },
        updateItem: function (name, cal) {
            // cal to num
            cal = parseInt(cal);
            let result = null;
            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = cal;
                    result = item;
                }
            })
            return result;
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        // get current item
        getCurrentItem: function () {
            return data.currentItem;
        },
        // remove item
        removeItem: function (id) {
            ids = data.items.map(function (item) {
                return item.id;
            })
            const index = ids.indexOf(id);
            data.items.splice(index, 1);
        },
        // clear all
        clearAllItems: function () {
            data.items = [];
        },
        getTotalCalories: function () {
            let total = 0;
            data.items.forEach(function (item) {
                total += item.calories;
            })
            // set total calories;
            data.totalCalories = total;
            // return data
            return data.totalCalories;
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
        listItems: '#item-list li',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        totalCalories: '.total-calories',
        clearAllBtn: '.clear-btn'
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
        // add new items
        addNewItems: function (item) {
            // show List
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong> ${item.name} </strong>
            <em>${item.calories}</em>
            <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>`;
            // inset to DOM
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemName).value,
                calories: document.querySelector(UISelectors.itemCalories).value
            }
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function (totalCal) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCal;
        },
        clearEditState: function () {
            UIController.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemName).value = '';
            document.querySelector(UISelectors.itemCalories).value = '';
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // Node list to array
            listItems = Array.from(listItems);

            listItems.forEach((listItem) => {
                const itemId = listItem.getAttribute('id');
                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong> ${item.name} </strong>
                    <em>${item.calories}</em>
                    <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>
                    `;
                }
            })
        },
        deleteListItem: function (id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        removeAllItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach((item) => {
                item.remove();
            })
        },
        // add item to form
        addItemToForm: function () {
            document.querySelector(UISelectors.itemName).value = ItemController.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalories).value = ItemController.getCurrentItem().calories;
            // show edit button
            UIController.showEditState();
        },
        // Get selectors
        getSelectors: function () {
            return UISelectors;
        },
    }
})();


// App Controller 
const App = (function (ItemController, UIController, storageController) {

    // Event Listeners 
    const loadEventListeners = function () {
        const UISelectors = UIController.getSelectors();

        // Add Item  
        document.querySelector(UISelectors.addBtn).addEventListener('click', addItem);

        // Edit Icon
        document.querySelector(UISelectors.itemList).addEventListener('click', editClick);

        // disable enter
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });
        // Update Button
        document.querySelector(UISelectors.updateBtn).addEventListener('click', updateItem);

        // Delete Button
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItem);

        // Back Button 
        document.querySelector(UISelectors.backBtn).addEventListener('click', UIController.clearEditState);

        // clear all button
        document.querySelector(UISelectors.clearAllBtn).addEventListener('click', clearAllItems);
    }
    // add item function 
    function addItem(e) {
        // Get item form UI controller 
        const input = UIController.getItemInput();

        // validation 
        if (input.name !== '' && input.calories !== '') {
            // Add Item
            const newItem = ItemController.addItems(input.name, input.calories);
            // Add item to ui
            UIController.addNewItems(newItem);
            // get total calories
            const totalCalories = ItemController.getTotalCalories();
            // add to UI
            UIController.showTotalCalories(totalCalories);

            // storage In localStorage
            storageController.storeItem(newItem);
            // Clear Inputs
            UIController.clearInput();
        }
        e.preventDefault();

    }

    // Edit icon click 
    const editClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // get list item id
            const listId = e.target.parentNode.parentNode.id;

            // break id
            const listIdArray = listId.split('-');
            const id = parseInt(listIdArray[1]);
            // get item 
            const itemToEdit = ItemController.getItemByID(id);
            // set Current Item
            ItemController.setCurrentItem(itemToEdit);

            // Add item to from
            UIController.addItemToForm();
        }
        e.preventDefault();
    }
    // update item
    const updateItem = function (e) {
        console.log(3434);
        // get item input
        const input = UIController.getItemInput();
        // update item
        const newInput = ItemController.updateItem(input.name, input.calories);
        // update UI
        UIController.updateListItem(newInput);
        // get total calories
        const totalCalories = ItemController.getTotalCalories();
        // add to UI
        UIController.showTotalCalories(totalCalories);

        // update local storage
        storageController.updateItemStorage(newInput);
        UIController.clearEditState();
        e.preventDefault();
    }

    // delete item 
    const deleteItem = function (e) {
        // get Current Item
        const currentItem = ItemController.getCurrentItem();
        // delete 
        ItemController.removeItem(currentItem.id);
        // delete form UI
        UIController.deleteListItem(currentItem.id);
        // get total calories
        const totalCalories = ItemController.getTotalCalories();
        // add to UI
        UIController.showTotalCalories(totalCalories);

        // delete form local storage
        storageController.deleteFromLocalStorage(currentItem.id);

        UIController.clearEditState();
        e.preventDefault();
    }

    // Clear All Items
    const clearAllItems = function () {
        // form database
        ItemController.clearAllItems();

        // get total calories
        const totalCalories = ItemController.getTotalCalories();
        // add to UI
        UIController.showTotalCalories(totalCalories);

        // from Storage
        storageController.clearAllFromLocalStorage();

        // clear from UI
        UIController.removeAllItems();
        // hide UL
        UIController.hideList();
    }
    return {
        init: function () {
            console.log('Initializing App...');

            // Buttons initializing
            UIController.clearEditState();

            const items = ItemController.getItems();

            // Check Empty UL or not
            if (items.length === 0) {
                UIController.hideList();
            } else {
                // Send Items to UI 
                UIController.populateItemList(items);
            }
            // get total calories
            const totalCalories = ItemController.getTotalCalories();
            // add to UI
            UIController.showTotalCalories(totalCalories);
            // Load event Listeners 
            loadEventListeners();
        }
    }
})(ItemController, UIController, storageController);

// Initialize App
App.init();