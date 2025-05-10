import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';

import { store } from './store';
import { Navigation } from './components/Navigation/Navigation';
import { HomeScreenList } from './pages/HomeScreen/HomeScreenList';
import { HomeScreenDetail } from './pages/HomeScreen/HomeScreenDetail';
import { ContentItemList } from './pages/ContentItem/ContentItemList';
import { ContentItemDetail } from './pages/ContentItem/ContentItemDetail';
import { EpisodeList } from './pages/Episode/EpisodeList';
import { EpisodeDetail } from './pages/Episode/EpisodeDetail';
import './styles/fonts.css';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

function AppContent() {
  return (
    <Router>
      <GlobalStyle />
      <AppLayout>
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeScreenList />} />
            <Route path="/home-screen/:id" element={<HomeScreenDetail />} />
            <Route path="/content-items" element={<ContentItemList />} />
            <Route path="/content-items/:id" element={<ContentItemDetail />} />
            <Route path="/episodes" element={<EpisodeList />} />
            <Route path="/episodes/:id" element={<EpisodeDetail />} />
          </Routes>
        </main>
      </AppLayout>
    </Router>
  );
}

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
      <AppContent />
    </Provider>
  );
}

export default App;
