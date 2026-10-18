
import type { Book } from './task1-types';
import { BookCatalog } from './task6-classes';

export class Wishlist {
  private favoriteIds: string[] = [];

  constructor(ids: string[] = []) {
    this.favoriteIds = [...ids];
  }

  toggle(id: string): void {
    if (this.favoriteIds.includes(id)) {
      this.favoriteIds = this.favoriteIds.filter(
        favoriteId => favoriteId !== id
      );
    } else {
      this.favoriteIds.push(id);
    }
  }

  has(id: string): boolean {
    return this.favoriteIds.includes(id);
  }

  getFavorites(catalog: BookCatalog): Book[] {
    return catalog.getBooks().filter(
      book => this.favoriteIds.includes(book.id)
    );
  }

  get count(): number {
    return this.favoriteIds.length;
  }

  getIds(): string[] {
    return [...this.favoriteIds];
  }
}
