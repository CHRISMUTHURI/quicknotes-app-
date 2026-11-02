// State management
let usersData = [];

// DOM Elements
const loadUsersBtn = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusParam = document.getElementById("status");
const usersList = document.getElementById("users-list");

/**
 * Render array of user objects into the DOM using createElement & textContent
 * @param {Array} list - Array of user objects
 */
function renderUsers(list) {
    // Clear existing list content
    usersList.innerHTML = "";

    if (list.length === 0) {
        statusParam.textContent = "No users match your filter.";
        return;
    }

    statusParam.textContent = `Displaying ${list.length} user(s).`;

    list.forEach(user => {
        const li = document.createElement("li");
        li.className = "user-card";

        const nameHeading = document.createElement("h3");
        nameHeading.textContent = user.name;

        const emailP = document.createElement("p");
        emailP.textContent = `Email: ${user.email}`;

        const cityP = document.createElement("p");
        cityP.textContent = `City: ${user.address?.city || "N/A"}`;

        const companyP = document.createElement("p");
        companyP.textContent = `Company: ${user.company?.name || "N/A"}`;

        li.appendChild(nameHeading);
        li.appendChild(emailP);
        li.appendChild(cityP);
        li.appendChild(companyP);

        usersList.appendChild(li);
    });
}

/**
 * Fetch users from API with handling for loading, success, and error states
 */
async function loadUsers() {
    statusParam.textContent = "Loading users...";
    loadUsersBtn.disabled = true;
    usersList.innerHTML = "";

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
            throw new Error(`HTTP Error status: ${response.status}`);
        }

        usersData = await response.json();
        statusParam.textContent = "Users loaded successfully!";
        renderUsers(usersData);
    } catch (error) {
        statusParam.textContent = `Failed to load users: ${error.message}`;
        console.error("Error fetching users:", error);
    } finally {
        loadUsersBtn.disabled = false;
    }
}

/**
 * Filter loaded users by name without refetching
 */
function filterUsers() {
    const searchTerm = filterInput.value.toLowerCase().trim();
    const filteredUsers = usersData.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    renderUsers(filteredUsers);
}

// Event Listeners
loadUsersBtn.addEventListener("click", loadUsers);
filterInput.addEventListener("input", filterUsers);