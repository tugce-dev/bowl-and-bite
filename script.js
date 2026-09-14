import { menuArray } from "./menudata.js";

const paymentModal = document.getElementById("payment-modal");
const paymentForm = document.getElementById("payment-form");
const orderArray = [];

document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    const menuItemId = Number(e.target.dataset.add);

    const selectedItem = menuArray.filter(function (menuItem) {
      return menuItem.id == menuItemId;
    })[0];

    const existingItem = orderArray.find(function (orderItem) {
      return orderItem.id === selectedItem.id;
    });

    if (existingItem) {
      existingItem.quantity++;
    } else {
      orderArray.push({
        ...selectedItem,

        quantity: 1,
      });
    }

    renderOrder();
  }
  if (e.target.dataset.remove) {
    const itemId = Number(e.target.dataset.remove);
    const itemIndex = orderArray.findIndex(function (orderItem) {
      return orderItem.id === itemId;
    });
    orderArray.splice(itemIndex, 1);
    renderOrder();
  }
  if (e.target.dataset.complete) {
    document.getElementById("payment-modal").style.display = "block";
    document.getElementById("modal-overlay").style.display = "block";
  }
  if (e.target.id === "modal-overlay") {
    paymentModal.style.display = "none";
    document.getElementById("modal-overlay").style.display = "none";
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      paymentModal.style.display = "none";
      document.getElementById("modal-overlay").style.display = "none";
    }
  });
  if (e.target.dataset.rating) {
    const rating = Number(e.target.dataset.rating);

    const stars = document.querySelectorAll(".stars button");

    stars.forEach(function (star) {
      const starValue = Number(star.dataset.rating);

      if (starValue <= rating) {
        star.classList.add("selected");
      } else {
        star.classList.remove("selected");
      }
    });

    document.getElementById("rating-message").textContent =
      `Thanks for rating us ${rating}/5!`;
  }
});
paymentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const paymentFormData = new FormData(paymentForm);
  const fullName = paymentFormData.get("fullName");

  paymentModal.style.display = "none";
  document.getElementById("modal-overlay").style.display = "none";
  orderArray.length = 0;
  paymentForm.reset();
  document.getElementById("order").innerHTML = `
         <div class="order-success">
    <p>Thanks, ${fullName}! Your order is on its way.</p>
    <div class="rating">
      <p>How was your experience?</p>
      <div class="stars">
        <button data-rating="1">★</button>
        <button data-rating="2">★</button>
        <button data-rating="3">★</button>
        <button data-rating="4">★</button>
        <button data-rating="5">★</button>
      </div>
      <p class="rating-message" id="rating-message"></p>
    </div>
  </div>

`;
});

function getOrderHtml() {
  if (orderArray.length === 0) {
    return "";
  }
  const totalPrice = orderArray.reduce(function (total, item) {
    return total + item.price * item.quantity;
  }, 0);
  let orderHtml = "";
  orderArray.forEach(function (orderItem) {
    orderHtml += `
            <div class="order-item">
                <div class="order-item-left">
                    <h3>${orderItem.name}</h3>
                    <button class="remove-btn" data-remove="${orderItem.id}">remove</button>
                </div>
                <p>x${orderItem.quantity}</p>
        <p>$${orderItem.price * orderItem.quantity}</p>
            </div>
        `;
  });
  return `<h2 class="order-title">Your order</h2>
        ${orderHtml}
        <div class="order-total">
    <p>Total price:</p>
    <p>$${totalPrice}</p>
  </div> 
  <button class="complete-order-btn" data-complete="true">Complete order</button>
`;
}

function renderOrder() {
  document.getElementById("order").innerHTML = getOrderHtml();
}

function getMenuHtml() {
  return menuArray
    .map(function (menuItem) {
      return `
            <div class="menu-item">
                <div class="menu-emoji">${menuItem.emoji}</div>
                <div class="menu-details">
                    <h3>${menuItem.name}</h3>
                    <p>${menuItem.ingredients}</p>
                    <p>$${menuItem.price}</p>
                </div>
                <button class="add-btn" data-add="${menuItem.id}">+</button>
            </div>
        `;
    })
    .join("");
}

function renderMenu() {
  document.getElementById("menu").innerHTML = getMenuHtml();
}

renderMenu();
