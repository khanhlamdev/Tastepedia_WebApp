import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider
        clientId="333264343602-enjnb52hck63vcc1rubmm4uep0o1in21.apps.googleusercontent.com"
        children={<App />}
    />
);