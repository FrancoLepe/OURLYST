

import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.js'; // Import the Firestore database instance
import './style.css'; // Ensure CSS is imported

// Function to handle adding items
function addItem(event) {
    event.preventDefault(); // Prevent the form from submitting the default way
    let text = document.getElementById("item-input").value.trim(); // Get and trim the input value

    if (text) {
        addDoc(collection(db, "items"), {
            text: text,
            status: "active"
        })
        .then(() => {
            console.log("Item added successfully!");
            // Refresh the item list after adding
            getItems(); // This will call generateItems which updates the count
        })
        .catch((error) => {
            console.error("Error adding item: ", error);
        });
    } else {
        console.log("Item cannot be empty.");
    }

    document.getElementById("item-input").value = ''; // Clear the input field
}

// Function to handle fetching items from Firestore
function getItems() {
    onSnapshot(collection(db, "items"), (snapshot) => {
        let items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        generateItems(items);
    });
}

// Function to count the number of items
function countItems() {
    const items = document.querySelectorAll('.item');
    return items.length;
}

// Function to update the item count in the UI
function updateItemCount() {
    const itemCount = countItems();
    document.querySelector('.items-in-list').textContent = `${itemCount} items`;
}

// Function to generate and display items
function generateItems(items) {
    let itemsHTML = "";
    items.forEach(item => {
        itemsHTML += `
            <div class="item ${item.status}" data-id="${item.id}">
                <div class="check-box">
                    <div class="check-mark"></div>
                </div>
                <div class="item-text">${item.text}</div>
                <button class="delete-btn">Delete</button>
            </div>
        `;
    });
    document.querySelector(".list-items").innerHTML = itemsHTML;
    addClickListeners(); // Add click event listeners to items
    addDeleteListeners(); // Add event listeners to delete buttons
    updateItemCount(); // Update the item count
}

// Function to add click listeners to items
function addClickListeners() {
    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('click', () => {
            console.log("Item clicked:", item);
            toggleItemStatus(item);
        });
    });
}

// Function to toggle the status of an item
function toggleItemStatus(item) {
    const itemId = item.getAttribute('data-id');
    const newStatus = item.classList.contains('completed') ? 'active' : 'completed';

    updateDoc(doc(db, "items", itemId), { status: newStatus })
        .then(() => {
            console.log("Item status updated!");
            item.classList.toggle('completed');
            const checkMark = item.querySelector('.check-mark');
            if (checkMark) {
                console.log('Toggling check-mark status');
                checkMark.classList.toggle('checked');
            }
        })
        .catch((error) => {
            console.error("Error updating item status: ", error);
        });
}

// Function to delete an item
function deleteItem(item) {
    const itemId = item.getAttribute('data-id');

    deleteDoc(doc(db, "items", itemId))
        .then(() => {
            console.log("Item successfully deleted!");
            item.remove();
            updateItemCount();
        })
        .catch((error) => {
            console.error("Error removing item: ", error);
        });
}

// Function to add delete button listeners
function addDeleteListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.item');
            deleteItem(item);
        });
    });
}

// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('item-form');
    if (form) {
        form.addEventListener('submit', addItem);
    }

    getItems(); // Initial load of items
});
