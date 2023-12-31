//  Wait for the DOM to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', function () {

    //  Retrieve necessary HTML elements
const amount = document.getElementById('amount');
const desc = document.getElementById('desc');
const cat = document.getElementById('cat');
const table = document.getElementById('expenseTable');
const tbody = table.querySelector('tbody');
const premiumButton = document.getElementById('premiumButton');

// Retrieve token from localStorage
const token = localStorage.getItem('token');

// Define a function to parse the JWT token
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

//Add an event listener for when the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () =>{ 
// Parse the JWT token to check if the user is a premium user
const decodedToken = parseJwt(token);
const isPremiumuser = decodedToken.isPremiumuser;
console.log(decodedToken, "isPremiumuser",  isPremiumuser);
if(isPremiumuser){
   showPremiumUser();
} 
 //  Make a GET request to fetch expenses from the backend
axios.get("http://localhost:3000/expense/getexpenses", { headers: { "Authorization": token } })
        .then((res) => {
            console.log(res.data.allExpense);
            const expense = res.data.allExpense;
            expense.forEach(obj => {
                // Create new table row for each expense
                const newRow = document.createElement('tr');
                const expenseDetail = [obj.amount, obj.description, obj.category];
                expenseDetail.forEach(function (value) {
                    const newCell = document.createElement('td');
                    newCell.textContent = value;
                    newRow.appendChild(newCell);
                });

                // Create delete button cell for each row
                const deleteCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-button');
                newRow.id = obj.id;

                deleteButton.addEventListener('click', function () {
                    // Remove the row from the table when the delete button is clicked
                    deleteFn(newRow);
                    newRow.remove();
                });
                deleteCell.appendChild(deleteButton);
                newRow.appendChild(deleteCell);

                // Append the new row to the table body
                tbody.appendChild(newRow);
            });

        })
        .catch((err) => {
            console.log(err);
        })
});

// Add an event listener for the add expense form submission
const addExpenseForm = document.getElementById('addExpenseForm');
addExpenseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const expObj = {
        amount: amount.value,
        description: desc.value,
        category: cat.value,
        userId: 1
    }
    console.log(expObj);
    axios.post("http://localhost:3000/expense/addexpense", expObj, { headers: { "Authorization": token } })
        .then((res) => {
            console.log(res.data.userId);

            // Create new table row for the added expense
            const newRow = document.createElement('tr');
            // Create table data cells
            const expenseDetail = [amount.value, desc.value, cat.value];
            expenseDetail.forEach(function (value) {
                const newCell = document.createElement('td');
                newCell.textContent = value;
                newRow.appendChild(newCell);
            });

            // Create delete button cell for the new row
            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            newRow.id = res.data.data.id;

            deleteButton.addEventListener('click', function () {
                // Remove the row from the table when the delete button is clicked
                deleteFn(newRow);
                newRow.remove();
            });
            deleteCell.appendChild(deleteButton);
            newRow.appendChild(deleteCell);

            // Append the new row to the table body
            tbody.appendChild(newRow);
            // Reset the form
            addExpenseForm.reset();

        })
        .catch((err) => {
            console.log(err);
        })
});

//Define the delete function
const deleteFn = function (newRow) {
    console.log(newRow.id);
    obj = {
        id: newRow.id
    }
    axios.post("http://localhost:3000/expense/deleteexpense", obj, { headers: { "Authorization": token } })
        .then(() => {
            console.log("deleted")
        })
        .catch((err) => {
            console.log(err);
        })
}
});

// Add an event listener for the premium button click
premiumButton.addEventListener('click', async function (e) {
// Retrieve the token again for the premium button click event
const token = localStorage.getItem('token');
const response = await axios.get("http://localhost:3000/purchase/premiummembership", { headers: { "Authorization": token } });

// Following is the code executed after I get a response from the buypremium membership controller.
console.log(response);
var options = {
    "key": response.data.key_id, // We give the key id so that Razorpay could know that it is a payment request referring to my company.
    "order_id": response.data.order.id, // This order id tells Razorpay about time amount and currency. This is already registered at Razorpay.
    // Following handler will handle the success payment. It is a callback function and it is called after the success of payment. This callback is executed by Razorpay itself.
    "handler": async function (response) {
        await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
            payStatus: true,
        }, { headers: { "Authorization": token } })
        alert("Congratulations! You Are Now a Premium User");
        //  premiumButton.remove(); // Removing the premium button once the user is a premium user.
        // Adding 'You are a premium user'.
        showPremiumUser();
    }
}

const rzp1 = new Razorpay(options);
rzp1.open(); // This opens the UI of Razorpay over our page.
e.preventDefault();

// Below code is to handle payment failure case. Again, this will be executed by Razorpay itself.
rzp1.on('payment.failed', async function (response) {
    console.log(response.error.metadata);
    alert('Payment Failed Please try Again');
    // Changing the payment status to "FAILED" in the order table
    await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
        order_id: response.error.metadata.order_id,
        payment_id: response.error.metadata.payment_id,
        payStatus: false,
    }, { headers: { "Authorization": token } })
});
});

// Define the showPremiumUser function
function showPremiumUser() {
const premiumButton = document.getElementById('premiumButton');
premiumButton.style.display = 'none';

var premiumUserDiv = document.getElementById('premiumuser');
var premiumUserButton = document.createElement('button');
premiumUserButton.textContent = 'You are now a Premium User';
premiumUserButton.className = 'premium-user-button';
// Append the button to the premiumuser div
premiumUserDiv.appendChild(premiumUserButton);

const leaderboardBtn = document.getElementById('leaderboardbtn');
leaderboardBtn.textContent = '🏆Show Leaderboard 🏆'
leaderboardBtn.onclick = async () => {
    try {
        //Retrieve the token again within the onclick function
       const token = localStorage.getItem('token');
       const leaderboardArray = await axios.get('http://localhost:3000/premium/showLeaderboard', { headers: { "Authorization": token } })

        console.log("leaderboardArray>>>>>>>>>>>>>>>>>>>>>", leaderboardArray.data);

        leaderboardArray.data.forEach((expenses) => {
            childElem = document.createElement('li');
            childElem.textContent = `Name ${expenses.name} Total Expenses - ${expenses.total ?? 0}`;
            console.log(childElem.textContent);
            leaderboardBtn.appendChild(childElem);
        })
    } catch (err) {
        console.log('Error fetching Leaderboard', err);
    }
}
}

