# Books Folder

This folder is for storing PDF books that kids can read.

## How to Add Books

1. Copy your PDF files into this folder (`public/books/`)
2. Update the book list in `src/components/BooksPage.tsx`
3. Add entries to the `bookList` array like this:

```typescript
const bookList: Book[] = [
  { name: 'My First Book', path: '/books/my-first-book.pdf' },
  { name: 'Animal Stories', path: '/books/animal-stories.pdf' },
  // Add more books here
];
```

## Example

If you have a file named `story.pdf`, add it like this:
- Copy `story.pdf` to this folder
- Add to the list: `{ name: 'Story Time', path: '/books/story.pdf' }`

The book will then appear on the Books page for kids to click and read!
