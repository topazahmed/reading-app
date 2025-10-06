import React, { useState, useEffect } from 'react';
import './BooksPage.scss';

interface Book {
  name: string;
  path: string;
}

const BooksLearningModule: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    // Load books from the public/books folder
    // In a real app, you'd have an API endpoint that lists the files
    // For now, we'll manually list the books
    const bookList: Book[] = [
      // Add your books here! Copy PDFs to public/books/ folder
      // Example:
      { name: 'Rainbow Adventure', path: '/books/rainbow.pdf' },
      // { name: 'Animal Stories', path: '/books/animal-stories.pdf' },
    ];
    setBooks(bookList);
  }, []);

  const handleBookClick = (bookPath: string) => {
    setSelectedBook(bookPath);
    setPdfError(false);
  };

  const handleCloseViewer = () => {
    setSelectedBook(null);
    setPdfError(false);
  };

  const handleOpenInNewTab = () => {
    if (selectedBook) {
      window.open(selectedBook, '_blank');
    }
  };

  return (
    <div className="books-learning-module">
      {!selectedBook ? (
        <>
          <div className="books-header">
            <h2 className="module-title">📚 My Books</h2>
            <p className="module-subtitle">Click on any book to start reading!</p>
          </div>

          <div className="books-grid">
            {books.length > 0 ? (
              books.map((book, index) => (
                <div
                  key={index}
                  className="book-card"
                  onClick={() => handleBookClick(book.path)}
                >
                  <div className="book-icon">📖</div>
                  <div className="book-name">{book.name}</div>
                </div>
              ))
            ) : (
              <div className="no-books">
                <div className="no-books-icon">📚</div>
                <h3>No books yet!</h3>
                <p>To add books:</p>
                <ol>
                  <li>Copy PDF files to <code>public/books/</code></li>
                  <li>Update the book list in <code>BooksLearningModule.tsx</code></li>
                  <li>Add entries like: <code>{`{ name: 'Book Title', path: '/books/file.pdf' }`}</code></li>
                </ol>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="pdf-viewer">
          <button className="close-viewer-button" onClick={handleCloseViewer}>
            ✖️ Close Book
          </button>
          <div className="pdf-container">
            {pdfError ? (
              <div className="pdf-fallback">
                <p>📄 Unable to display PDF in browser.</p>
                <button 
                  onClick={handleOpenInNewTab}
                  className="open-pdf-button"
                >
                  📖 Open PDF in New Tab
                </button>
              </div>
            ) : (
              <>
                <object
                  data={`${selectedBook}#toolbar=0`}
                  type="application/pdf"
                  className="pdf-frame"
                  onError={() => setPdfError(true)}
                >
                  <embed
                    src={`${selectedBook}#toolbar=0`}
                    type="application/pdf"
                    className="pdf-frame"
                  />
                </object>
                <button 
                  onClick={handleOpenInNewTab}
                  className="open-new-tab-button"
                >
                  � Open in New Tab
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksLearningModule;
