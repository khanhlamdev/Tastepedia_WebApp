import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider
        clientId="732709280045-e6b9evtip1ctpfbqcnlunl4cv7gcf98g.apps.googleusercontent.com"
        children={
            <BrowserRouter>
                <App />
            </BrowserRouter>
        }
    />
);