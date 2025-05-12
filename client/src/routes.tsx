import { Routes, Route } from 'react-router-dom';
import { HomeScreenList } from './pages/HomeScreen/HomeScreenList';
import { HomeScreenDetail } from './pages/HomeScreen/HomeScreenDetail';
import { ContentItemList } from './pages/ContentItem/ContentItemList';
import { ContentItemDetail } from './pages/ContentItem/ContentItemDetail';
import { EpisodeList } from './pages/Episode/EpisodeList';
import { EpisodeDetail } from './pages/Episode/EpisodeDetail';
import { Navigation } from './components/Navigation/Navigation';

export const AppRoutes = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomeScreenList />} />
        <Route path="/home-screen/:id" element={<HomeScreenDetail />} />
        <Route path="/content-items" element={<ContentItemList />} />
        <Route path="/content-items/:id" element={<ContentItemDetail />} />
        <Route path="/episodes" element={<EpisodeList />} />
        <Route path="/episodes/:id" element={<EpisodeDetail />} />
      </Routes>
    </>
  );
}; 