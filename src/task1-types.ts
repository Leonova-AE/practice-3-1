// Задание 1: Интерфейсы и типы
// Описание модели каталога книг

// TODO 1: Объявите интерфейс Book
export interface Book {
  readonly id: string;
  title: string;
  authors: string[];
  year?: number;
  rating?: number;
}


// TODO 3: Объявите тип BookFilter как функцию, которая принимает Book и возвращает boolean
export type BookFilter = (book: Book) => boolean;


// Функция formatBook(book: Book): string в формате: "Title (Year) — Authors"
/** @deprecated в main.ts пока не используется (только внутри BookClass.format), задел на фичу "Экспорт списка книг" */
export function formatBook(book: Book): string {
  const yearStr = book.year !== undefined ? ` (${book.year})` : "";
  const authorsStr = book.authors.join(", ");
  return `${book.title}${yearStr} — ${authorsStr}`;
}

// Функция calculateAverageYear(books: Book[]): number возвращает средний год издания. Если книг нет или у них нет года — вернуть 0.
/** @deprecated пока не используется, задел на фичу "Статистика" */
export function calculateAverageYear(books: Book[]): number {
  const booksWithYear = books.filter((book) => book.year !== undefined);

  if (booksWithYear.length === 0) return 0;

  const sum = booksWithYear.reduce(
    // используем as number так как позже запретим предавать что-то кроме цифр 
    (acc, book) => acc + (book.year as number),
    0
  );

  return sum / booksWithYear.length;
}