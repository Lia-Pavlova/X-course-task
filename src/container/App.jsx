import { useState, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { Layout } from '../routes';
import SignIn from '../components/SignIn';
import Cart from '../components/Cart';
import NotFoundPage from '../components/NotFoundPage';
import SpecificBook from '../components/SpecificBook';
import BookList from '../components/BookList';

import { BooksProvider } from '../contexts/BooksContext';
import { CartProvider } from '../contexts/CartContext';

import './app.scss';

function App() {
  const [userName, setUserName] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    let storedUserName = localStorage.getItem('userName');
    if (storedUserName !== null && storedUserName !== '') {
      setUserName(storedUserName);
      setIsUserLoggedIn(true);
    }
  }, []);

  const handleSignIn = (userName) => {
    setUserName(userName);
    setIsUserLoggedIn(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    setUserName('');
    setIsUserLoggedIn(false);
  };

  return (
    <ErrorBoundary
      fallback={
        <div>
          <h1>Something went wrong.</h1>
          <p>
            Oops. Something happened. Please try refreshing the page.
          </p>
        </div>
      }
    >
      <BooksProvider>
        <CartProvider userName={userName}>
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout
                    isUserLoggedIn={isUserLoggedIn}
                    userName={userName}
                    handleSignOut={handleSignOut}
                  />
                }
              >
                <Route index element={<SignIn handleSignIn={handleSignIn} />} />
                <Route
                  path="signin"
                  element={<SignIn handleSignIn={handleSignIn} />}
                />
                <Route
                  path="cart"
                  element={
                    <Cart isUserLoggedIn={isUserLoggedIn} userName={userName} />
                  }
                />
                <Route
                  path="books"
                  element={
                    <BookList
                      isUserLoggedIn={isUserLoggedIn}
                      userName={userName}
                    />
                  }
                />
                <Route
                  path="books/:id"
                  element={
                    <SpecificBook
                      isUserLoggedIn={isUserLoggedIn}
                      userName={userName}
                    />
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </HashRouter>
        </CartProvider>
      </BooksProvider>
    </ErrorBoundary>
  );
}

export default App;
