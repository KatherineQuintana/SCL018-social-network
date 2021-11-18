// importar cada archivo de template hacia aca
import { feedSpace } from '../templates/nav.js';
import { templateLogin } from '../templates/login.js';
import { templateSignUp } from '../templates/signup.js';

// Efectivamente mostrar los hash
export const changeRouter = (hash) => {
  const containerRoot = document.getElementById('root');
  containerRoot.innerHTML = '';
  /* La declaración switch compara el valor de una expresión# con una instancia case,
  y ejecuta declaraciones asociadas a ese case (ej. appendChild). */
  switch (hash) {
    case '#/':
    case '#/login':
      containerRoot.appendChild(templateLogin());
      break;
    case '#/register':
      containerRoot.appendChild(templateSignUp());
      break;
    case '#/feed':
      containerRoot.appendChild(feedSpace());
      break;
    default:
      containerRoot.innerHTML = '<h1>Ups!, no hay nada. Mientras esperas, toma un tecito ~(=^.^)_旦~</h1>';
  }
};
