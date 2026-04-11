
let allBooks = []; 

const resultsGrid = document.getElementById('results-grid');
const loadingIndicator = document.getElementById('loading-indicator');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterDropdown = document.getElementById('filter-dropdown');
const sortDropdown = document.getElementById('sort-dropdown');


async function fetchBooks(query) {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block'; 
    }
    resultsGrid.innerHTML = ''; 

    try {

        const response = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=20`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        

        allBooks = data.docs;
        
        renderCards(allBooks);

    } 
    catch (error) {
        console.error('Error fetching data:', error);
        resultsGrid.innerHTML = `<p style="text-align: center; color: red;">Failed to load data from the archive.</p>`;
    } 
    finally {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none'; 
        }
    }
}


function renderCards(booksArray) {
    if (booksArray.length === 0) {
        resultsGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No books found matching your criteria.</p>';
        return;
    }

    const htmlString = booksArray.map(book => {
        const coverImg = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
            : 'https://placehold.co/250x320?text=No+Cover';
        
        const title = book.title || 'Unknown Title';
        const author = book.author_name ? book.author_name[0] : 'Unknown Author';
        const year = book.first_publish_year || 'Unknown Year';

        return `
            <div class="book-card">
                <img src="${coverImg}" alt="${title} cover" class="book-cover">
                <div class="book-info">
                    <h3 class="book-title">${title}</h3>
                    <p class="book-author">By: ${author}</p>
                    <p class="book-year">Published: ${year}</p>
                </div>
            </div>
        `;
    }).join('');

    resultsGrid.innerHTML = htmlString;
}

function updateDisplay() {

    let currentBooks = [...allBooks];


    const filterValue = filterDropdown.value;
    if (filterValue === 'fulltext') {
        currentBooks = currentBooks.filter(book => book.has_fulltext === true);
    }


    const sortValue = sortDropdown.value;
    if (sortValue === 'newest') {
        currentBooks.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
    } else if (sortValue === 'oldest') {
        currentBooks.sort((a, b) => (a.first_publish_year || 9999) - (b.first_publish_year || 9999));
    }

    renderCards(currentBooks);
}

searchBtn.onclick = function() {
    const query = searchInput.value;
    if (query !== '') { 
        fetchBooks(query);
    }
};

filterDropdown.onchange = function() {
    updateDisplay();
};

sortDropdown.onchange = function() {
    updateDisplay();
};

fetchBooks('history');