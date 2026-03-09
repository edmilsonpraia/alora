// Base de dados centralizada - Firebase Realtime Database
// Para configurar: edite FIREBASE_CONFIG abaixo com os dados do seu projeto Firebase

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyD0LqRbM0TRg50QO4QBt5zNSD8tWkq_7_Q",
    authDomain: "allora-83266.firebaseapp.com",
    databaseURL: "https://allora-83266-default-rtdb.firebaseio.com",
    projectId: "allora-83266",
    storageBucket: "allora-83266.firebasestorage.app",
    messagingSenderId: "15370217538",
    appId: "1:15370217538:web:d4703e978e40aab38ce5db",
    measurementId: "G-LYR266TND7"
};

// Estado global
let _dbReady = false;
let _dbRef = null;
let _listeners = [];
let _cachedData = [];

// Inicializar Firebase
function initDB() {
    try {
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK não carregado. Usando localStorage como fallback.');
            return false;
        }

        // Verificar se config está preenchida
        if (FIREBASE_CONFIG.apiKey === 'SUA_API_KEY') {
            console.warn('Firebase não configurado. Usando localStorage como fallback.');
            return false;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }

        _dbRef = firebase.database().ref('respostas');
        _dbReady = true;

        // Escutar mudanças em tempo real
        _dbRef.on('value', (snapshot) => {
            const data = snapshot.val();
            _cachedData = data ? Object.values(data) : [];
            // Notificar todos os listeners
            _listeners.forEach(fn => fn(_cachedData));
        });

        console.log('Firebase conectado com sucesso!');
        return true;
    } catch (e) {
        console.error('Erro ao inicializar Firebase:', e);
        return false;
    }
}

// API pública do DB
const DB = {
    // Guardar uma resposta
    save: function(data) {
        // Sempre guardar no localStorage como backup
        const local = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
        local.push(data);
        localStorage.setItem('surveyResponses', JSON.stringify(local));

        const submissions = JSON.parse(localStorage.getItem('surveySubmissions') || '[]');
        submissions.push(data);
        localStorage.setItem('surveySubmissions', JSON.stringify(submissions));

        // Guardar no Firebase se disponível
        if (_dbReady && _dbRef) {
            _dbRef.push(data).catch(err => {
                console.error('Erro ao guardar no Firebase:', err);
            });
        }
    },

    // Obter todas as respostas
    getAll: function() {
        if (_dbReady && _cachedData.length > 0) {
            return _cachedData;
        }
        // Fallback para localStorage
        return JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    },

    // Obter respostas filtradas por campo
    getByField: function(campo) {
        return this.getAll().filter(r => r[campo]);
    },

    // Escutar atualizações em tempo real
    onUpdate: function(callback) {
        _listeners.push(callback);
        // Chamar imediatamente com dados atuais
        if (_dbReady && _cachedData.length > 0) {
            callback(_cachedData);
        }
    },

    // Remover listener
    offUpdate: function(callback) {
        _listeners = _listeners.filter(fn => fn !== callback);
    },

    // Limpar todos os dados
    clear: function() {
        localStorage.removeItem('surveyResponses');
        localStorage.removeItem('surveySubmissions');

        if (_dbReady && _dbRef) {
            _dbRef.remove().catch(err => {
                console.error('Erro ao limpar Firebase:', err);
            });
        }
    },

    // Verificar se Firebase está ativo
    isOnline: function() {
        return _dbReady;
    }
};

// Auto-inicializar quando o script carrega
document.addEventListener('DOMContentLoaded', () => {
    initDB();
});
