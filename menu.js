import { getMenuData } from "./menu.mjs";

// Helper function to create a clean menu row
function createMenuRow(name, price, description = null) {
    const row = document.createElement("div");
    row.classList.add("menu-row");

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("item-name");
    nameSpan.textContent = name;

    const priceSpan = document.createElement("span");
    priceSpan.classList.add("item-price");
    // Check if price is a number before fixing decimal, otherwise print as is
    priceSpan.textContent = typeof price === 'number' ? `$${price.toFixed(2)}` : price;

    row.appendChild(nameSpan);
    row.appendChild(priceSpan);

    // Return an array or a wrapper if description exists, but for simplicity
    // we append the row, and if description exists, we append a separate desc div.
    return row;
}

// Helper for descriptions
function createDescription(text) {
    const desc = document.createElement("div");
    desc.classList.add("item-desc");
    desc.textContent = text;
    return desc;
}

// Helper for section headers
function createSubHeader(text) {
    const header = document.createElement("h3");
    header.classList.add("menu-sub-header");
    header.textContent = text;
    return header;
}

async function populateBreakFast() {
    const menuData = await getMenuData();
    const container = document.getElementById("breakfastItems");

    menuData.breakfast.meal.forEach(meal => {
        container.appendChild(createMenuRow(meal.name, meal.price));
    });

    // Divider for Eggs
    container.appendChild(createSubHeader("Eggs & Omelettes"));

    menuData.breakfast.eggs.forEach(meal => {
        let displayName = meal.name;
        // Handle the array of egg types
        if (Array.isArray(meal.name)) {
             displayName = `Eggs (3): ${meal.name.join(", ")}`;
        }
        container.appendChild(createMenuRow(displayName, meal.price));
    });
}

async function populateSandWiches() {
    const menuData = await getMenuData();
    const container = document.getElementById("sandwichItems");

    // Student Meal Special
    container.appendChild(createSubHeader("Student Deal"));
    container.appendChild(createMenuRow("Student Meal", menuData.studentMeal.price));
    container.appendChild(createDescription(menuData.studentMeal.description));

    // Regular Sandwiches
    container.appendChild(createSubHeader("Cold Sandwiches"));
    menuData.sandWiches.nonGrilled.sandwiches.forEach(meal => {
        // Create a custom row for half/full pricing
        const row = document.createElement("div");
        row.classList.add("menu-row");
        
        const nameSpan = document.createElement("span");
        nameSpan.classList.add("item-name");
        nameSpan.textContent = meal.name;

        const priceSpan = document.createElement("span");
        priceSpan.classList.add("item-price");
        priceSpan.textContent = `Half: $${meal.halfPrice} / Full: $${meal.fullPrice}`;

        row.appendChild(nameSpan);
        row.appendChild(priceSpan);
        container.appendChild(row);
    });

    // Addons
    const addonTitle = createSubHeader("Customize Your Sandwich");
    container.appendChild(addonTitle);
    
    const addonList = document.createElement("p");
    addonList.classList.add("addon-list");
    addonList.textContent = menuData.sandWiches.nonGrilled.addOns.join(", ");
    container.appendChild(addonList);
}

async function populateGrilledSandWiches() {
    const menuData = await getMenuData();
    const container = document.getElementById("grilledSandwichItems");

    menuData.sandWiches.GrilledSandwiches.sandwiches.forEach(meal => {
        container.appendChild(createMenuRow(meal.name, meal.price));
    });

    const addonTitle = createSubHeader("Customize");
    container.appendChild(addonTitle);
    
    const addonList = document.createElement("p");
    addonList.classList.add("addon-list");
    addonList.textContent = menuData.sandWiches.GrilledSandwiches.addOns.join(", ");
    container.appendChild(addonList);
}

async function populateKidsMenu() {
    const menuData = await getMenuData();
    const container = document.getElementById("kidsMenuItems");

    menuData.kidsMenu.meal.forEach(meal => {
        container.appendChild(createMenuRow(meal.name, meal.price));
    });
}

async function populateSoupSize() {
    const menuData = await getMenuData();
    const container = document.getElementById("soupMenuItems");

    container.appendChild(createSubHeader("Sizes"));
    menuData.soups.size.forEach(size => {
        container.appendChild(createMenuRow(size.name, size.price));
    });

    container.appendChild(createSubHeader("Daily Schedule"));
    menuData.soups.dayOfWeek.forEach(soup => {
        // Reusing the menu row style, but passing day as name and soup as 'price' (conceptually)
        const row = document.createElement("div");
        row.classList.add("menu-row");
        
        const daySpan = document.createElement("span");
        daySpan.classList.add("item-name");
        daySpan.textContent = soup.day;

        const soupSpan = document.createElement("span");
        soupSpan.classList.add("item-price");
        soupSpan.style.color = "#555"; // Make soup name distinct color
        soupSpan.textContent = soup.name;

        row.appendChild(daySpan);
        row.appendChild(soupSpan);
        container.appendChild(row);
    });
}

async function populateDrinks() {
    const menuData = await getMenuData();
    const container = document.getElementById("drinkMenuItems");

    container.appendChild(createSubHeader("Lemonade"));
    menuData.drinks.lemonade.forEach(drink => {
        container.appendChild(createMenuRow(drink.name, drink.price));
        if(drink.description) {
            container.appendChild(createDescription(drink.description));
        }
    });

    container.appendChild(createSubHeader("Other Drinks"));
    menuData.drinks.other.forEach(drink => {
        container.appendChild(createMenuRow(drink.name, drink.price));
    });
}

function populateMenu() {
    populateBreakFast();
    populateSandWiches();
    populateGrilledSandWiches();
    populateKidsMenu();
    populateSoupSize();
    populateDrinks();
}

// Event Listeners for Accordions
const idButtonList = ["breakfastButton", "sandwichButton", "grilledSandwichButton", "kidsButton", "soupButton", "drinkButton"];

function changeHideClass(idElement) {
    let containerId = "";
    // Mapping button ID to container ID
    if (idElement == "breakfastButton") containerId = "breakFastContainer";
    else if (idElement == "sandwichButton") containerId = "sandwichMenuContainer";
    else if (idElement == "grilledSandwichButton") containerId = "grilledSandwichContainer";
    else if (idElement == "kidsButton") containerId = "kidsMenuContainer";
    else if (idElement == "soupButton") containerId = "soupsContainer";
    else if (idElement == "drinkButton") containerId = "drinkContainer";

    const container = document.getElementById(containerId);
    container.classList.toggle("hide");
    
    // Optional: Rotate arrow
    const btn = document.getElementById(idElement);
    const arrow = btn.querySelector(".arrow");
    if(container.classList.contains("hide")) {
        arrow.style.transform = "rotate(0deg)";
    } else {
        arrow.style.transform = "rotate(180deg)";
    }
}

idButtonList.forEach(id => {
    document.getElementById(id).addEventListener("click", () => {
        changeHideClass(id);
    });
});

document.addEventListener("DOMContentLoaded", populateMenu);
