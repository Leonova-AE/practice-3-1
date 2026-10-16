// ============================================================
// Практика 3: Классы и ООП
// ============================================================
// Цель: заменить функциональный каталог из Практик 2.1–2.2
// на класс с состоянием.
//
// Проверка: npm test -- task6
// ============================================================

import { Book, formatBook } from "./task1-types";
import { createBookFromForm } from "./task4-integration";
import { filterByTitle, sortBooks } from "./task5-utils";

/*
  Реализуйте класс BookCatalog.

  Состояние:
    - books: Book[]        — приватное, снаружи недоступно
    - id: string           — readonly

  Конструктор: (id: string, books: Book[] = [])

  Публичный API:
    addBook(book: Book): void
    removeBook(id: string): void
    getBooks(): Book[]
    searchByTitle(query: string): Book[]
    sortBy(sortType: 'year' | 'rating'): Book[]
    get count(): number

  Требования:
    - addBook / removeBook не мутируют массив, а создают новый
    - searchByTitle и sortBy переиспользуют filterByTitle / sortBooks
    - внешний код не может присвоить this.books напрямую

  Бонус: класс Book с полями id, title, authors, year?, rating?,
  методом format() и статическим createFromFormData(FormData).
*/

export class BookCatalog {
  // поля: books приватное, id только для чтения
  private books: Book[];
  readonly id: string;

  constructor(id: string, books: Book[] = []) {
    this.id = id;
    // делаем копию, чтобы не зависеть от внешнего массива
    this.books = [...books];
  }

  // не используем push, чтобы не мутировать массив: создаём новый
  addBook(book: Book): void {
    this.books = [...this.books, book];
  }

  // filter тоже возвращает новый массив
  removeBook(id: string): void {
    this.books = this.books.filter((b) => b.id !== id);
  }

  // наружу отдаём копию, а не сам массив
  getBooks(): Book[] {
    return [...this.books];
  }

  // логику заново не пишем — берём filterByTitle из task5-utils
  searchByTitle(query: string): Book[] {
    return this.books.filter(filterByTitle(query));
  }

  // и здесь берём готовую sortBooks из task5-utils
  sortBy(sortType: "year" | "rating"): Book[] {
    return sortBooks(this.books, sortType);
  }

  // возвращает число (скаляр), поэтому геттер, а не метод
  get count(): number {
    return this.books.length;
  }
}

// ------------------------------------------------------------
// Бонус: класс BookClass
// Название BookClass, чтобы не конфликтовать с интерфейсом Book
// ------------------------------------------------------------
export class BookClass {
  readonly id: string;
  title: string;
  authors: string[];
  year?: number;
  rating?: number;

  constructor(
    id: string,
    title: string,
    authors: string[],
    year?: number,
    rating?: number
  ) {
    this.id = id;
    this.title = title;
    this.authors = authors;
    this.year = year;
    this.rating = rating;
  }

  // логика из formatBook: "Title (Year) — Authors"
  format(): string {
    return formatBook(this);
  }

  // static — вызывается через имя класса: BookClass.createFromFormData(formData)
  // разбор формы и проверка рейтинга уже есть в createBookFromForm
  static createFromFormData(formData: FormData): BookClass {
    const book = createBookFromForm(formData);
    return new BookClass(book.id, book.title, book.authors, book.year, book.rating);
  }
}