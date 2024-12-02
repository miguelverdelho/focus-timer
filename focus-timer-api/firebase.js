import { initializeApp } from 'firebase/app';
import config from './config.js';

const f = initializeApp(config.firebaseConfig);

export default f;