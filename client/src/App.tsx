import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';

import { store } from './store';
import { AppRoutes } from './routes';
import './styles/fonts.css';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;


const AppLayout = styled.div`
  padding: 0;
  margin: 0;
  background-color: #0c0c0c;
  min-height: 100%;
  display: flex;
  flex-direction: column;

  .main-content {
    flex: 1;
  }
`;

function App() {
  return (
    <Provider store={store}>
      <Router>
        <GlobalStyle />
        <AppLayout>
          <div className="main-content">
            <AppRoutes />
          </div>
        </AppLayout>
      </Router>
    </Provider>
  );
}

export default App;
