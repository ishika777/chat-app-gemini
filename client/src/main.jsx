import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "remixicon/fonts/remixicon.css"
import App from './App.jsx'

import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist"; 
import { store } from './store/store.js'
import { Toaster } from './components/ui/sonner'

let persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
//   <StrictMode>
<Provider store={store}>
<PersistGate loading={null} persistor={persistor}>
    <App />
    <Toaster />
</PersistGate>
</Provider>
//   </StrictMode>,
)
