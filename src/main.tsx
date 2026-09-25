import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/bebas-neue';
import '@fontsource/oswald/400.css';
import '@fontsource/oswald/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import './styles.css';
import App from './App';

// Close <details> dropdown menus on outside click or after choosing an item
document.addEventListener('click', (e) => {
  const target = e.target as Element;
  document.querySelectorAll('details.menu[open]').forEach((d) => {
    if (!d.contains(target) || target.closest('.menu-pop button')) d.removeAttribute('open');
  });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
