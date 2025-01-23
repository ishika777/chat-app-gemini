import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "remixicon/fonts/remixicon.css"
import App from './App.jsx'

import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { Toaster } from './components/ui/sonner'

createRoot(document.getElementById('root')).render(
//   <StrictMode>
<Provider store={store}>
    <App />
    <Toaster />
</Provider>
//   </StrictMode>,
)