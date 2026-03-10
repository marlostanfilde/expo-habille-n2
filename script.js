const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const searchToggle = document.getElementById("searchToggle");
const searchBar = document.getElementById("searchBar");

const pretaporterToggle = document.getElementById("pretaporterToggle");
const pretaporterSubmenu = document.getElementById("pretaporterSubmenu");
const mobileMenuMain = document.getElementById("mobileMenuMain");
const backToMainMenu = document.getElementById("backToMainMenu");

function resetMobileSubmenu() {
  if (mobileMenuMain) {
    mobileMenuMain.classList.remove("is-hidden");
  }

  if (pretaporterSubmenu) {
    pretaporterSubmenu.classList.add("is-hidden");
  }

  if (pretaporterToggle) {
    pretaporterToggle.setAttribute("aria-expanded", "false");
  }
}

function openPretaporterSubmenu() {
  if (!mobileMenuMain || !pretaporterSubmenu || !pretaporterToggle) return;

  mobileMenuMain.classList.add("is-hidden");
  pretaporterSubmenu.classList.remove("is-hidden");
  pretaporterToggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  if (mobileMenu && menuToggle) {
    mobileMenu.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    resetMobileSubmenu();
  }
}

function closeSearch() {
  if (searchBar && searchToggle) {
    searchBar.classList.remove("active");
    searchToggle.setAttribute("aria-expanded", "false");
  }
}

function toggleMenu() {
  if (!mobileMenu || !menuToggle) return;

  const isOpen = mobileMenu.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    closeSearch();
    resetMobileSubmenu();
  } else {
    resetMobileSubmenu();
  }
}

function toggleSearch() {
  if (!searchBar || !searchToggle) return;

  const isOpen = searchBar.classList.toggle("active");
  searchToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    closeMenu();
  }
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", toggleMenu);
}

if (searchToggle && searchBar) {
  searchToggle.addEventListener("click", toggleSearch);
}

if (pretaporterToggle) {
  pretaporterToggle.addEventListener("click", openPretaporterSubmenu);
}

if (backToMainMenu) {
  backToMainMenu.addEventListener("click", resetMobileSubmenu);
}

document.addEventListener("click", (event) => {
  const target = event.target;

  if (
    mobileMenu &&
    menuToggle &&
    !mobileMenu.contains(target) &&
    !menuToggle.contains(target)
  ) {
    closeMenu();
  }

  if (
    searchBar &&
    searchToggle &&
    !searchBar.contains(target) &&
    !searchToggle.contains(target)
  ) {
    closeSearch();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeSearch();
  }
});

if (mobileMenu) {
  const menuLinks = mobileMenu.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

const USERS_KEY = "modeldexpo_users";
const CURRENT_USER_KEY = "modeldexpo_current_user";
const CART_KEY = "modeldexpo_cart";
const PROMO_KEY = "modeldexpo_promo";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getPromo() {
  return JSON.parse(localStorage.getItem(PROMO_KEY)) || null;
}

function savePromo(promo) {
  localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
}

function clearPromo() {
  localStorage.removeItem(PROMO_KEY);
}

function formatPrice(value) {
  return `${Number(value).toFixed(2).replace(".", ",")} €`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function showMessage(container, message, type = "success") {
  if (!container) return;

  container.textContent = message;
  container.style.marginTop = "14px";
  container.style.padding = "12px 14px";
  container.style.borderRadius = "8px";
  container.style.fontSize = "14px";
  container.style.fontWeight = "600";

  if (type === "success") {
    container.style.background = "#edf7ed";
    container.style.color = "#1f5f2c";
    container.style.border = "1px solid #b7dfbf";
  } else {
    container.style.background = "#fff1f1";
    container.style.color = "#8a1f1f";
    container.style.border = "1px solid #efc2c2";
  }
}

function createMessageBox(form) {
  if (!form) return null;

  let box = form.querySelector(".form-message");

  if (!box) {
    box = document.createElement("div");
    box.className = "form-message";
    form.appendChild(box);
  }

  return box;
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  document.querySelectorAll(".cart-count").forEach((counter) => {
    counter.textContent = count;
  });
}

function updateAccountHeader() {
  const accountLinks = document.querySelectorAll('a[href="compte.html"]');
  const currentUser = getCurrentUser();

  accountLinks.forEach((link) => {
    if (currentUser && currentUser.firstName) {
      link.setAttribute("title", `Connecté : ${currentUser.firstName}`);
    } else {
      link.removeAttribute("title");
    }
  });
}

function addToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += product.quantity || 1;
  } else {
    cart.push(product);
  }

  saveCart(cart);
}

function initProductButtons() {
  const addButtons = document.querySelectorAll(".add-to-cart-btn");

  addButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const name = button.dataset.name;
      const price = Number(button.dataset.price);
      const category = button.dataset.category || "";
      const image = button.dataset.image || name;

      if (!name || !price) return;

      addToCart({
        id: slugify(name),
        name,
        price,
        category,
        image,
        quantity: 1,
      });

      updateCartCount();
      window.location.href = "panier.html";
    });
  });
}

function initAccountPage() {
  const loginForm = document.querySelector(".login-form");
  const registerForm = document.querySelector(".register-form");
  const accountPageRoot = document.querySelector(".account-page");
  const currentUser = getCurrentUser();

  if (!accountPageRoot) return;

  if (currentUser) {
    renderLoggedInView(accountPageRoot, currentUser);
    return;
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const firstName = registerForm.querySelector("#register-firstname")?.value.trim();
      const lastName = registerForm.querySelector("#register-lastname")?.value.trim();
      const email = registerForm.querySelector("#register-email")?.value.trim().toLowerCase();
      const password = registerForm.querySelector("#register-password")?.value;
      const confirmPassword = registerForm.querySelector("#register-confirm-password")?.value;
      const terms = registerForm.querySelector('input[type="checkbox"]')?.checked;

      const messageBox = createMessageBox(registerForm);

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showMessage(messageBox, "Merci de remplir tous les champs.", "error");
        return;
      }

      if (!email.includes("@")) {
        showMessage(messageBox, "Merci de saisir une adresse e-mail valide.", "error");
        return;
      }

      if (password.length < 6) {
        showMessage(messageBox, "Le mot de passe doit contenir au moins 6 caractères.", "error");
        return;
      }

      if (password !== confirmPassword) {
        showMessage(messageBox, "Les mots de passe ne correspondent pas.", "error");
        return;
      }

      if (!terms) {
        showMessage(messageBox, "Vous devez accepter les conditions pour créer un compte.", "error");
        return;
      }

      const users = getUsers();
      const existingUser = users.find((user) => user.email === email);

      if (existingUser) {
        showMessage(messageBox, "Un compte existe déjà avec cette adresse e-mail.", "error");
        return;
      }

      const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        password,
      };

      users.push(newUser);
      saveUsers(users);
      saveCurrentUser(newUser);
      updateAccountHeader();
      showMessage(messageBox, "Compte créé avec succès. Vous êtes maintenant connecté.", "success");
      registerForm.reset();

      setTimeout(() => {
        renderLoggedInView(accountPageRoot, newUser);
      }, 400);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = loginForm.querySelector("#login-email")?.value.trim().toLowerCase();
      const password = loginForm.querySelector("#login-password")?.value;
      const messageBox = createMessageBox(loginForm);

      if (!email || !password) {
        showMessage(messageBox, "Merci de remplir votre e-mail et votre mot de passe.", "error");
        return;
      }

      const users = getUsers();
      const user = users.find((item) => item.email === email && item.password === password);

      if (!user) {
        showMessage(messageBox, "Identifiants incorrects. Vérifiez vos informations.", "error");
        return;
      }

      saveCurrentUser(user);
      updateAccountHeader();
      showMessage(messageBox, "Connexion réussie.", "success");
      loginForm.reset();

      setTimeout(() => {
        renderLoggedInView(accountPageRoot, user);
      }, 400);
    });
  }
}

function renderLoggedInView(root, user) {
  root.innerHTML = `
    <h1 class="page-title">Bienvenue ${user.firstName}</h1>

    <div class="account-layout">
      <div class="account-box">
        <div class="account-box-head">
          <h2>Mon espace</h2>
          <p>Vous êtes connecté à votre compte MODEL D'EXPO.</p>
        </div>

        <div class="form-card pro-form">
          <label>Prénom</label>
          <input type="text" value="${user.firstName}" disabled />

          <label>Nom</label>
          <input type="text" value="${user.lastName}" disabled />

          <label>Adresse e-mail</label>
          <input type="email" value="${user.email}" disabled />

          <button type="button" class="btn dark full-btn" id="logoutBtn">Se déconnecter</button>
        </div>
      </div>

      <div class="account-box">
        <div class="account-box-head">
          <h2>Mes avantages</h2>
          <p>Retrouvez ici les fonctions clés d’un compte client.</p>
        </div>

        <div class="page-card">
          <h2>Suivi des commandes</h2>
          <p>Consultez vos achats et l’état de vos commandes.</p>
        </div>

        <div class="page-card">
          <h2>Informations personnelles</h2>
          <p>Gardez vos coordonnées à jour pour commander plus vite.</p>
        </div>

        <div class="page-card">
          <h2>Préférences boutique</h2>
          <p>Profitez d’une expérience plus fluide lors de vos prochaines visites.</p>
        </div>
      </div>
    </div>
  `;

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logoutUser();
      updateAccountHeader();
      window.location.reload();
    });
  }
}

function initCartPage() {
  const cartContainer = document.querySelector(".cart-main");
  const summaryCard = document.querySelector(".summary-card");
  const promoButton = document.querySelector(".apply-promo-btn");
  const promoInput = document.querySelector("#promo");

  if (!cartContainer || !summaryCard) return;

  renderCartPage();

  if (promoButton && promoInput) {
    promoButton.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();

      if (code === "MODELEXPO10") {
        savePromo({ code, percent: 10 });
        renderCartPage();
        showToast("Code promo appliqué : -10%");
      } else if (code === "") {
        clearPromo();
        renderCartPage();
      } else {
        showToast("Code promo invalide.");
      }
    });
  }
}

function renderCartPage() {
  const cartContainer = document.querySelector(".cart-main");
  const summarySubtotal = document.querySelector('[data-summary="subtotal"]');
  const summaryDiscount = document.querySelector('[data-summary="discount"]');
  const summaryTotal = document.querySelector('[data-summary="total"]');
  const cartCountLabel = document.querySelector('[data-cart-label="count"]');

  if (!cartContainer) return;

  const cart = getCart();
  const promo = getPromo();

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="page-card">
        <h2>Votre panier est vide</h2>
        <p>Ajoutez des pièces MODEL D'EXPO pour commencer votre sélection.</p>
        <div class="page-actions">
          <a href="index.html" class="btn">Découvrir la collection</a>
        </div>
      </div>
    `;

    if (summarySubtotal) summarySubtotal.textContent = formatPrice(0);
    if (summaryDiscount) summaryDiscount.textContent = formatPrice(0);
    if (summaryTotal) summaryTotal.textContent = formatPrice(0);
    if (cartCountLabel) cartCountLabel.textContent = "0 article";
    updateCartCount();
    return;
  }

  cartContainer.innerHTML =
    cart
      .map((item, index) => {
        const itemTotal = item.price * item.quantity;
        const itemImageHtml =
          item.image && String(item.image).startsWith("http")
            ? `<img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" />`
            : `${item.image || item.name}`;

        return `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">${itemImageHtml}</div>

            <div class="cart-item-info">
              <h2>${item.name}</h2>
              <p>${item.category || "Collection MODEL D'EXPO"}</p>
              <button class="remove-btn" type="button" data-remove="${item.id}">
                Supprimer
              </button>
            </div>

            <div class="cart-item-qty">
              <label for="qty-${index}">Quantité</label>
              <select id="qty-${index}" data-qty="${item.id}">
                ${[1, 2, 3, 4, 5]
                  .map(
                    (qty) =>
                      `<option value="${qty}" ${qty === item.quantity ? "selected" : ""}>${qty}</option>`
                  )
                  .join("")}
              </select>
            </div>

            <div class="cart-item-price">${formatPrice(itemTotal)}</div>
          </div>
        `;
      })
      .join("") +
    `
      <div class="cart-note">
        <p>Besoin d’aide ? Notre service client vous accompagne dans votre commande et vos choix.</p>
      </div>
    `;

  attachCartEvents();

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = promo ? subtotal * (promo.percent / 100) : 0;
  const total = subtotal - discount;
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (summarySubtotal) summarySubtotal.textContent = formatPrice(subtotal);
  if (summaryDiscount) summaryDiscount.textContent = `- ${formatPrice(discount)}`;
  if (summaryTotal) summaryTotal.textContent = formatPrice(total);
  if (cartCountLabel) {
    cartCountLabel.textContent = `${itemCount} article${itemCount > 1 ? "s" : ""}`;
  }

  updateCartCount();
}

function attachCartEvents() {
  const removeButtons = document.querySelectorAll("[data-remove]");
  const quantityFields = document.querySelectorAll("[data-qty]");

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.remove;
      const cart = getCart().filter((item) => item.id !== id);
      saveCart(cart);
      renderCartPage();
      updateCartCount();
      showToast("Produit supprimé du panier.");
    });
  });

  quantityFields.forEach((field) => {
    field.addEventListener("change", () => {
      const id = field.dataset.qty;
      const quantity = Number(field.value);
      const cart = getCart();
      const product = cart.find((item) => item.id === id);

      if (!product) return;

      product.quantity = quantity;
      saveCart(cart);
      renderCartPage();
      updateCartCount();
    });
  });
}

function initSearch() {
  const searchInput = document.querySelector(".search-bar input");
  const searchButton = document.querySelector(".search-bar button");

  if (!searchInput || !searchButton) return;

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const cards = document.querySelectorAll(".card");
    if (!cards.length) return;

    let found = false;

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const match = text.includes(query);
      card.style.display = match ? "block" : "none";
      if (match) found = true;
    });

    if (!found) {
      showToast("Aucun produit trouvé pour cette recherche.");
    }
  });
}

function showToast(message) {
  const existingToast = document.querySelector(".toast");

  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2200);
}

function initDynamicProductPage() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const price = params.get("price");
  const image = params.get("image");
  const brand = params.get("brand");
  const ref = params.get("ref");
  const color = params.get("color");
  const material = params.get("material");
  const description = params.get("description");

  if (!name || !price || !image) return;

  const mainImage = document.getElementById("productMainImage");
  const title = document.getElementById("productTitle");
  const priceNode = document.getElementById("productPrice");
  const breadcrumb = document.getElementById("breadcrumbProduct");
  const refNode = document.getElementById("productRef");
  const colorNode = document.getElementById("productColor");
  const materialNode = document.getElementById("productMaterial");
  const descriptionNode = document.getElementById("productDescription");
  const extraDescriptionNode = document.getElementById("productExtraDescription");
  const addBtn = document.getElementById("productAddBtn");
  const thumb1 = document.getElementById("thumb1");

  if (mainImage) {
    mainImage.src = image;
    mainImage.alt = name;
  }

  if (thumb1) {
    thumb1.dataset.image = image;
  }

  if (title) title.textContent = name;
  if (breadcrumb) breadcrumb.textContent = name;
  if (priceNode) priceNode.textContent = formatPrice(price);
  if (refNode) refNode.textContent = ref || "-";
  if (colorNode) colorNode.textContent = color || "-";
  if (materialNode) materialNode.textContent = material || "-";

  const finalDescription =
    description || `Une pièce premium ${brand ? brand : ""} sélectionnée par MODEL D'EXPO.`;

  if (descriptionNode) descriptionNode.textContent = finalDescription;
  if (extraDescriptionNode) extraDescriptionNode.textContent = finalDescription;

  if (addBtn) {
    addBtn.dataset.name = name;
    addBtn.dataset.price = price;
    addBtn.dataset.image = image;
    addBtn.dataset.category = brand ? `Chaussures · ${brand}` : "Chaussures";
  }

  document.title = `${name} | MODEL D'EXPO`;
}

function initProductPage() {
  const mainImage = document.getElementById("productMainImage");
  const thumbs = document.querySelectorAll(".product-thumb");
  const addButton = document.querySelector(".product-add-btn");
  const sizeSelect = document.getElementById("product-size");
  const qtySelect = document.getElementById("product-qty");

  if (mainImage && thumbs.length) {
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        thumbs.forEach((item) => item.classList.remove("active"));
        thumb.classList.add("active");

        if (thumb.dataset.image) {
          mainImage.src = thumb.dataset.image;
        }
      });
    });
  }

  if (addButton) {
    addButton.addEventListener("click", () => {
      const name = addButton.dataset.name;
      const price = Number(addButton.dataset.price);
      const category = addButton.dataset.category || "";
      const image = addButton.dataset.image || "";
      const size = sizeSelect ? sizeSelect.value : "";
      const quantity = qtySelect ? Number(qtySelect.value) : 1;

      if (!name || !price) return;

      if (!size) {
        showToast("Merci de choisir une pointure.");
        return;
      }

      const cart = getCart();
      const productId = `${slugify(name)}-${size}`;
      const existingProduct = cart.find((item) => item.id === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.push({
          id: productId,
          name,
          price,
          category: `${category} · Taille ${size}`,
          image,
          quantity,
        });
      }

      saveCart(cart);
      updateCartCount();
      showToast("Produit ajouté au panier.");
    });
  }
}

function initFeaturedSlider() {
  const slider = document.getElementById("featuredSlider");
  const prevBtn = document.getElementById("featuredPrev");
  const nextBtn = document.getElementById("featuredNext");

  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".featured-slide"));
  if (slides.length < 2) return;

  let currentIndex = 0;
  let autoSlide;

  function showSlide(index) {
    slides.forEach((slide) => {
      slide.classList.remove("active", "previous");
    });

    const previousIndex = currentIndex;
    currentIndex = (index + slides.length) % slides.length;

    slides[previousIndex].classList.add("previous");
    slides[currentIndex].classList.add("active");
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 3500);
  }

  function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  slides[0].classList.add("active");
  startAutoSlide();
}

document.addEventListener("DOMContentLoaded", () => {
  resetMobileSubmenu();
  updateCartCount();
  updateAccountHeader();
  initProductButtons();
  initAccountPage();
  initCartPage();
  initSearch();
  initDynamicProductPage();
  initProductPage();
  initFeaturedSlider();
});
