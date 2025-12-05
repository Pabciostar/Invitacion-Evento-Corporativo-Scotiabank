// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. Inicialización de la Aplicación
// Esto verifica si Firebase ya se ha inicializado para evitar errores de Next.js
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

// 💡 Inicialización de Firebase App Check (reCAPTCHA)
// Esto solo debe ejecutarse en el lado del cliente (navegador)
if (typeof window !== 'undefined') {
    // ⚠️ La clave de reCAPTCHA también es pública (Site Key)
    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY; 

    if (RECAPTCHA_SITE_KEY) {
        // Habilitar token de debug solo en desarrollo local
        if (process.env.NODE_ENV === 'development') {
            // Este token DEBE registrarse en la consola de Firebase > App Check
            self.FIREBASE_APPCHECK_DEBUG_TOKEN = true; 
        }

        initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY), 
            isTokenAutoRefreshEnabled: true
        });
    } else {
        console.warn("RECAPTCHA_SITE_KEY no está configurada. App Check no se inicializó.");
    }
}

// Exportar la instancia de la base de datos
export const db = getFirestore(app);