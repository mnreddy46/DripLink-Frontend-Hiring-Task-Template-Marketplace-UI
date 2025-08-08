const templates = [
  { id: 1, name: "Classic", cost: 0, style: "color:white;background:black;font-family:monospace;text-shadow:0 0 5px cyan" },
  { id: 2, name: "Backdrop", cost: 200, style: "background:rgba(0,0,0,0.5);color:white;padding:4px;font-family:monospace;text-shadow:0 0 5px cyan" },
  { id: 3, name: "Highlight", cost: 300, style: "background:yellow;color:black;padding:4px;font-family:monospace;text-shadow:0 1 5px cyan" },
  { id: 4, name: "Glow", cost: 250, style: "background:rgba(0,0,0,0.5);color:white;text-shadow:0 0 5px cyan;font-family:monospace" },
  { id: 5, name: "Mono", cost: 100, style: "color:white;font-family:monospace;background:black;text-shadow:0 0 5px cyan" }
];

let balance = parseInt(localStorage.getItem("balance")) || 500;
let purchased = JSON.parse(localStorage.getItem("purchased")) || [];
let cart = [];

const balanceEl = document.getElementById("balance");
const templateGrid = document.getElementById("template-grid");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout");

function updateBalance() {
  balanceEl.textContent = `Balance: ${balance} coins`;
  localStorage.setItem("balance", balance);
}

function renderTemplates() {
  templateGrid.innerHTML = "";
  templates.forEach(t => {
    const card = document.createElement("div");
    card.className = "template-card";
    const preview = document.createElement("div");
    preview.className = "template-preview";
    preview.style = t.style;
    preview.textContent = "Sample Subtitle";

    const name = document.createElement("h3");
    name.textContent = t.name;

    const cost = document.createElement("p");
    cost.textContent = `Cost: ${t.cost} coins`;

    const btn = document.createElement("button");
    if (purchased.includes(t.id)) {
      btn.textContent = "Purchased";
      btn.disabled = true;
    } else if (cart.includes(t.id)) {
      btn.textContent = "In Cart";
      btn.disabled = true;
    } else {
      btn.textContent = "Add to Cart";
      btn.onclick = () => {
        cart.push(t.id);
        renderCart();
        renderTemplates();
      };
    }

    card.append(preview, name, cost, btn);
    templateGrid.appendChild(card);
  });
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;
  cart.forEach(id => {
    const item = templates.find(t => t.id === id);
    total += item.cost;

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.marginBottom = "5px";

    const name = document.createElement("span");
    name.textContent = item.name;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.onclick = () => {
      cart = cart.filter(cid => cid !== id);
      renderCart();
      renderTemplates();
    };

    row.append(name, removeBtn);
    cartItemsEl.appendChild(row);
  });
  cartTotalEl.textContent = `Total: ${total} coins`;
}

checkoutBtn.onclick = () => {
  let total = cart.reduce((sum, id) => sum + templates.find(t => t.id === id).cost, 0);
  if (balance >= total) {
    balance -= total;
    purchased = [...purchased, ...cart];
    cart = [];
    localStorage.setItem("purchased", JSON.stringify(purchased));
    updateBalance();
    renderCart();
    renderTemplates();
    alert(`Purchase successful! Remaining credits: ${balance}`);
  } else {
    alert("Insufficient credits!");
  }
};

updateBalance();
renderTemplates();
renderCart();
