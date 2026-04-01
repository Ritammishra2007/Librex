
const resultsGrid = document.getElementById('results-grid');
const loadingIndicator = document.getElementById('loading-indicator');


async function fetchBooks() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }

    try {
        const response = await fetch('https://openlibrary.org/search.json?q=javascript&limit=12');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const booksArray = data.docs;
        renderCards(booksArray);

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
        resultsGrid.innerHTML = '<p style="text-align: center;">No books found.</p>';
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
    }).join('')

    resultsGrid.innerHTML = htmlString;
}
window.addEventListener('DOMContentLoaded', fetchBooks);