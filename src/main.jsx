import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Note: StrictMode removed to prevent double-mounting of hooks
// which causes duplicate Supabase auth listeners
createRoot(document.getElementById('root')).render(<App />)
