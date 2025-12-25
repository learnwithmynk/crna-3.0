/**
 * Root App component for The CRNA Club
 */

import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme="coral" background="dusk">
        <RouterProvider router={router} />
        <Toaster position="bottom-right" richColors />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
