
import './styles.css';
import type { Book } from './task1-types';
import { applyFilters, filterByAuthor, filterByMinYear } from './task3-filters';
import { createBookFromForm } from './task4-integration';
import { filterByTitle, sortBooks } from './task5-utils';
import { BookCatalog } from './task6-classes';
import { Wishlist } from './task7-wishlist';

let catalog = new BookCatalog('main', [
  { id: '1', title: 'TypeScript Guide', authors: ['John Doe'], year: 2024 },
  { id: '2', title: 'JavaScript Basics', authors: ['Jane Smith'], year: 2022 },
]);

const saved = localStorage.getItem('catalog');

if (saved) {
  const parsed = JSON.parse(saved);

  if (parsed.books) {
    catalog = new BookCatalog(parsed.id, parsed.books);
  }
}

const savedWishlist = localStorage.getItem('wishlist');

let favoriteIds: string[] = [];

if (savedWishlist) {
  const parsed: unknown = JSON.parse(savedWishlist);

  if (
    Array.isArray(parsed) &&
    parsed.every(id => typeof id === 'string')
  ) {
    favoriteIds = parsed as string[];
  }
}

const wishlist = new Wishlist(favoriteIds);

function saveCatalog(): void {
  localStorage.setItem('catalog', JSON.stringify({
    id: catalog.id,
    books: catalog.getBooks(),
  }));
}

function saveWishlist(): void {
  localStorage.setItem(
    'wishlist',
    JSON.stringify(wishlist.getIds())
  );
}

const bookList = document.querySelector('#bookList') as HTMLDivElement;
const wishlistContainer = document.querySelector('#wishlistContainer') as HTMLDivElement;
const form = document.querySelector('#bookForm') as HTMLFormElement;
const filterBtn = document.querySelector('#applyFilters') as HTMLButtonElement;
const authorInput = document.querySelector('#filterAuthor') as HTMLInputElement;
const yearInput = document.querySelector('#filterYear') as HTMLInputElement;
const errorMessage = document.querySelector('#errorMessage') as HTMLDivElement;
const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
const sortBySelect = document.querySelector('#sortBy') as HTMLSelectElement;

function createBookCard(book: Book): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'book-card';

  const titleEl = document.createElement('h3');
  titleEl.textContent = `${book.title} — ${book.authors.join(', ')}${book.year ? `, ${book.year}` : ''}`;
  card.append(titleEl);

  if (book.rating !== undefined) {
    const ratingEl = document.createElement('p');
    ratingEl.textContent = `Рейтинг: ${book.rating}`;
    card.append(ratingEl);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';

  deleteBtn.addEventListener('click', () => {
    catalog.removeBook(book.id);
    saveCatalog();
    refreshList();
    renderWishlist();
  });

  card.append(deleteBtn);

  const favBtn = document.createElement('button');

  favBtn.textContent = wishlist.has(book.id)
    ? '❤️ В избранном'
    : '🤍 В избранное';

  favBtn.addEventListener('click', () => {
    wishlist.toggle(book.id);
    saveWishlist();
    refreshList();
    renderWishlist();
  });

  card.append(favBtn);

  return card;
}

function renderBooks(books: Book[]): void {
  bookList.innerHTML = '';

  if (books.length === 0) {
    bookList.textContent = 'Книги не найдены. Попробуйте изменить фильтры.';
    return;
  }

  books.forEach(book => {
    bookList.append(createBookCard(book));
  });
}

function renderWishlist(): void {
  wishlistContainer.innerHTML = '';

  const favBooks = wishlist.getFavorites(catalog);

  if (favBooks.length === 0) {
    wishlistContainer.textContent = 'Пока ничего не добавлено';
    return;
  }

  favBooks.forEach(book => {
    wishlistContainer.append(createBookCard(book));
  });
}

function refreshList(): void {
  const filters: ((book: Book) => boolean)[] = [];

  if (authorInput.value.trim()) {
    filters.push(filterByAuthor(authorInput.value.trim()));
  }

  if (yearInput.value) {
    filters.push(filterByMinYear(parseInt(yearInput.value, 10)));
  }

  if (searchInput.value.trim()) {
    filters.push(filterByTitle(searchInput.value.trim()));
  }

  const allBooks = catalog.getBooks();
  const filteredBooks = applyFilters(allBooks, filters);

  renderBooks(
    sortBooks(filteredBooks, sortBySelect.value as 'year' | 'rating')
  );
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMessage.textContent = '';

  try {
    const formData = new FormData(form);
    const newBook = createBookFromForm(formData);

    catalog.addBook(newBook);
    saveCatalog();

    form.reset();
    refreshList();
    renderWishlist();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.textContent = error.message;
    }
  }
});

filterBtn.addEventListener('click', refreshList);
searchInput.addEventListener('input', refreshList);
sortBySelect.addEventListener('change', refreshList);

refreshList();
renderWishlist();
