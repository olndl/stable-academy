import { Route, Routes } from 'react-router';
import { Layout } from '../components/Layout';
import { HomePage } from '../pages/HomePage';
import { EmptyPage } from '../pages/EmptyPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="courses" element={<EmptyPage section="courses" />} />
        <Route path="my-learning" element={<EmptyPage section="learning" />} />
        <Route path="diary" element={<EmptyPage section="diary" />} />
        <Route path="statistics" element={<EmptyPage section="statistics" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
