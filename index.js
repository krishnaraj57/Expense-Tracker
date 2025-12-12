const dataController = (function () {
  const UrlLink = "https://691d4f49d58e64bf0d35b0a9.mockapi.io/api/v1/user";

  const Items = function (id, name, money) {
    this.id = id;
    this.name = name;
    this.money = money;
  };

  const data = {
    items: [],
    currentItem: null,
    TotalMoney: 0,
    lengthCount: 0,
  };

  return {
    loadItems: async function () {
      try {
        const response = await fetch(UrlLink);

        const items = await response.json();

        data.items = items;

        return items;
      } catch (error) {}
    },

    dataTurnIntoPublic: function () {
      return data.items;
    },

    dataPushIntoConstructor: async function (name, money) {
      // console.log(name, money);
      try {
        const response = await fetch(UrlLink, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            name: name,
            money: parseInt(money),
          }),
        });

        let itemsObj = await response.json();

        data.items.push(itemsObj);

        return itemsObj;
      } catch {
        console.log("ki");
      }
    },

    updateValues: function (id) {
      // let currentItems = null;

      data.items.forEach(function (item) {
        const number = parseInt(item.id);

        if (number === id) {
          currentItems = item;
        }
      });

      return currentItems;
    },

    setCurrentItem: function (currentItems) {
      data.currentItem = currentItems;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    updateDates: async function (id, name, money) {
      try {
        const response = await fetch(`${UrlLink}/${id}`, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            name: name,
            money: parseInt(money),
          }),
        });

        updatedValue = await response.json();

        console.log(updatedValue);

        data.items.forEach(function (item) {
          if (item.id === id) {
            item.name = updatedValue.name;
            item.money = parseInt(updatedValue.money);
          }
        });
      } catch (error) {
        console.log("err");
      }
    },

    deleteItem: async function (id) {
      const response = await fetch(`${UrlLink}/${id}`, {
        method: "DELETE",
      });
    },

    totalMoney: function () {
      let Total = 0;

      if (data.items.length > 0) {
        data.items.forEach(function (item) {
          Total += item.money;

          data.TotalMoney = Total;
        });
      } else {
        return (data.TotalMoney = 0);
      }

      return Total;
    },

    taskCount: function () {
      let length = 0;

      if (data.items.length > 0) {
        length += data.items.length;
        data.lengthCount = length;
      } else {
        console.log("hhh");
        return (data.lengthCount = 0);
      }

      return length;
    },

    // deleteUrlData: async function (items) {
    //   try {
    //     const deleteAll = await fetch(`${UrlLink}/${items.id}`, {
    //       method: "DELETE",
    //     });
    //   } catch (error){
    //     console.log("jhg")
    //   }
    // },
  };
})();

console.log(dataController.loadItems());

const UIController = (function () {
  return {
    getDataFromUI: function () {
      return {
        name: document.querySelector("#name").value,
        money: document.querySelector("#money").value,
      };
    },

    dataShowInUI: function (dataItems) {
      let html = "";

      dataItems.forEach(function (item) {
        html += ` <div class="task-item" id="item-${item.id}">
                  <div class="task-info">
                    <div class="task-name">${item.name}</div>
                    <div class="task-amount">₹${item.money}</div>
                  </div>
                  <button class="btn-edit-ios">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                </div>
              `;
      });

      document.querySelector("#item-list").innerHTML = html;
    },

    clearInputs: function () {
      document.querySelector("#name").value = "";
      document.querySelector("#money").value = "";
    },

    showThreeBtn: function () {
      document.querySelector(".add-btn").style.display = "none";
      document.querySelector(".button-group").style.display = "flex";
      document.querySelector(".back-btn").style.display = "block";
    },

    backBtn: function () {
      document.querySelector(".add-btn").style.display = "inline-block";
      document.querySelector(".button-group").style.display = "none";
      document.querySelector(".back-btn").style.display = "none";
    },

    fillTheCurrentValueInInput: function (currentItemValues) {
      document.querySelector("#name").value = currentItemValues.name;
      document.querySelector("#money").value = currentItemValues.money;
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;

      const item = document.querySelector(`${itemID}`);

      item.remove();
    },

    showTotalMoney: function (money) {
      document.querySelector(".total").innerText = money;
    },

    showTaskCount: function (count) {
      document.querySelector(".task-count").innerText = count;
    },
  };
})();

const appController = (function () {
  const loadPage = function () {
    document.querySelector(".add-btn").addEventListener("click", showDataInUI);
    document
      .querySelector("#item-list")
      .addEventListener("click", showThreeBtn);
    document.querySelector(".back-btn").addEventListener("click", backBtn);
    document
      .querySelector(".update-btn")
      .addEventListener("click", updateThePreviousValue);
    document
      .querySelector(".delete-btn")
      .addEventListener("click", deleteItems);
    // document
    //   .querySelector(".btn-trash")
    //   .addEventListener("click", clearAllTask);
  };

  const showDataInUI = async function (e) {
    e.preventDefault();
    const input = UIController.getDataFromUI();

    if (input.name === "" || input.money === "") {
      alert("pls fill the name & money ");
    } else {
      const itemsObj = await dataController.dataPushIntoConstructor(
        input.name,
        input.money
      );

      console.log(itemsObj);

      const dataItems = dataController.dataTurnIntoPublic();

      UIController.dataShowInUI(dataItems);

      const money = dataController.totalMoney();

      UIController.showTotalMoney(money);

      const taskCount = dataController.taskCount();

      UIController.showTaskCount(taskCount);

      UIController.clearInputs();
    }
  };

  const showThreeBtn = function (e) {
    if (e.target.parentElement.classList.contains("btn-edit-ios")) {
      UIController.showThreeBtn();

      const listId = e.target.parentElement.parentElement.id;

      const splitListId = listId.split("-");

      const id = parseInt(splitListId[1]);

      const currentItems = dataController.updateValues(id);

      dataController.setCurrentItem(currentItems);

      const currentItemValues = dataController.getCurrentItem();

      UIController.fillTheCurrentValueInInput(currentItemValues);

      // console.log(dataController.getCurrentItem());
    }
  };

  const updateThePreviousValue = async function () {
    const input = UIController.getDataFromUI();

    if (input.name === "" || input.money === "") {
      alert("Please fill name & money");
    } else {
      const currentItemValues = dataController.getCurrentItem();

      const currentItems = await dataController.updateDates(
        currentItemValues.id,
        input.name,
        input.money
      );

      const dataItems = dataController.dataTurnIntoPublic();

      UIController.dataShowInUI(dataItems);

      UIController.backBtn();

      const money = dataController.totalMoney();

      UIController.showTotalMoney(money);

      UIController.clearInputs();
    }
  };

  const deleteItems = async function () {
    const currentItemValues = dataController.getCurrentItem();

    await dataController.deleteItem(currentItemValues.id);

    UIController.deleteListItem(currentItemValues.id);

    UIController.backBtn();

    const money = dataController.totalMoney();

    UIController.showTotalMoney(money);

    const taskCount = dataController.taskCount();

    UIController.showTaskCount(taskCount);

    window.location.reload();

    UIController.clearInputs();
  };
  const backBtn = function () {
    UIController.backBtn();

    UIController.clearInputs();
  };

  // const clearAllTask = async function () {
  //   try {
  //     const dataItems = dataController.dataTurnIntoPublic();

  //     const deleteData = await dataController.deleteUrlData(dataItems);
  //   } catch {}
  // };

  return {
    start: async function () {
      loadPage();

      try {
        const items = await dataController.loadItems();

        if (items.length > 0) {
          UIController.dataShowInUI(items);

          const money = dataController.totalMoney();

          UIController.showTotalMoney(money);

          const taskCount = dataController.taskCount();

          UIController.showTaskCount(taskCount);
        } else {
          document.querySelector(".empty-state").style.display = "inline";
        }
      } catch {}
    },
  };
})();

appController.start();
