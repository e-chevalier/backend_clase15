import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { config_firestore } from '../../config/firestore.js'


const GOOGLE_APPLICATION_CREDENTIALS  = config_firestore.google_application_credentials

initializeApp({
    credential: applicationDefault()
});

export const db_firestore = getFirestore();

