import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './components/app/app';
import store from './services/store';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

/* При React.StrictMode в режиме разработки дважды монтирует компоненты,
в связи с этим получил два экземпляра DnD бэкенда. Приложение упало с ошибкой.
В поиске нашел инфу, что для проектов с DnD часто рекомендуют отключать StrictMode,
так как он может вызывать проблемы с библиотеками перетаскивания. Что и было сделано. */

root.render(
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DndProvider>
  </Provider>
);
