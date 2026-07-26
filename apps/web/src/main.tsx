import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Providers } from './app/providers';
import { router } from './app/router';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The application root element is missing.');
}

ReactDOM.createRoot(rootElement).render(
  <Providers>
    <RouterProvider router={router} />
  </Providers>
);
