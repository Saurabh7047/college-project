
const data = [
    { name: 'Item 1', date: '2024-03-25' },
    { name: 'Item 2', date: '2024-03-26' },
    { name: 'Item 3', date: '2024-03-27' },
    { name: 'Item 4', date: '2024-03-28' },
    { name: 'Item 5', date: '2024-03-28' }
];

// Function to filter data based on a specific date
function filterData() {
    const targetDate = document.getElementById('filterDate').value;
    
    const filteredData = data.filter(item => {
        return item.date === targetDate;
    });

    displayFilteredData(filteredData);
}

// Function to display filtered data
function displayFilteredData(filteredData) {
    const filteredDataDiv = document.getElementById('filteredData');
    filteredDataDiv.innerHTML = '';

    if (filteredData.length === 0) {
        filteredDataDiv.innerHTML = '<p>No data available for selected date.</p>';
        return;
    }

    const ul = document.createElement('ul');
    filteredData.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.date}`;
        ul.appendChild(li);
    });
    filteredDataDiv.appendChild(ul);
}
