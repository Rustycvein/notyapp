const API_URL = 'https://notyapp-yuu5.onrender.com/api/notifications'; 

let successChart: any = null;
let channelChart: any = null;
let currentToken: string = "";

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    if (themeIcon && themeText) {
        themeIcon.innerText = newTheme === 'dark' ? '☀️' : '🌙';
        themeText.innerText = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
});

const firebaseConfig = {
    apiKey: "AIzaSyBHRahazkAM2Ie6QZboEA27AK8ktEp0VmY",
    authDomain: "notyapp-c6df7.firebaseapp.com",
    projectId: "notyapp-c6df7",
    storageBucket: "notyapp-c6df7.firebasestorage.app",
    messagingSenderId: "814479822487",
    appId: "1:814479822487:web:4218cd1e5c6c11fa3ea3d2"
};

async function initFirebase() {
    try {
        const app = (window as any).firebase.initializeApp(firebaseConfig);
        const messaging = (window as any).firebase.messaging();
        const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
        await navigator.serviceWorker.ready;
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await messaging.getToken({ 
                vapidKey: 'BAP6YCcEwjybseoconrvFvrs71xXYy5RzkwiGLrBnhFhlVwlBkkVXtwcv3TERsSd_2sxUnbNO1lhTpGvbq0WNVA',
                serviceWorkerRegistration: registration 
            });
            if (token) {
                currentToken = token;
                updateToFieldWithToken();
            }
        }
    } catch (e) { console.error(e); }
}

const typeSelect = document.getElementById('type') as HTMLSelectElement;
const toInput = document.getElementById('to') as HTMLInputElement;

function updateToFieldWithToken() {
    if (!typeSelect || !toInput) return;
    if (typeSelect.value === 'push') {
        toInput.value = currentToken;
        toInput.placeholder = "FCM Token (Auto)";
    } else if (typeSelect.value === 'email') {
        toInput.value = "";
        toInput.placeholder = "user@example.com";
    } else {
        toInput.value = "";
        toInput.placeholder = "+123456789";
    }
}

typeSelect?.addEventListener('change', updateToFieldWithToken);

(window as any).showSection = (sectionId: string) => {
    document.querySelectorAll('.main-content section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById(`section-${sectionId}`)?.classList.remove('hidden');
    document.getElementById(`btn-${sectionId}`)?.classList.add('active');
    if (sectionId === 'stats') updateCharts();
    if (sectionId === 'logs') loadLogs();
};

async function updateCharts() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        const stats = await res.json();
        const ctxS = (document.getElementById('successChart') as HTMLCanvasElement).getContext('2d');
        const ctxC = (document.getElementById('channelChart') as HTMLCanvasElement).getContext('2d');
        
        if (successChart) successChart.destroy();
        successChart = new (window as any).Chart(ctxS, {
            type: 'doughnut',
            data: {
                labels: ['Sent', 'Failed'],
                datasets: [{
                    data: [stats.sent, stats.failed],
                    backgroundColor: ['#22c55e', '#ef4444']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        if (channelChart) channelChart.destroy();
        channelChart = new (window as any).Chart(ctxC, {
            type: 'bar',
            data: {
                labels: ['Email', 'SMS', 'Push'],
                datasets: [{
                    label: 'Volume',
                    data: [stats.channels.email, stats.channels.sms, stats.channels.push],
                    backgroundColor: '#6366f1'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    } catch (e) { console.error(e); }
}

async function loadLogs() {
    try {
        const res = await fetch(`${API_URL}/logs`);
        const logs = await res.json();
        const body = document.getElementById('logsTableBody');
        if (body) {
            body.innerHTML = logs.map((log: any) => `
                <tr>
                    <td>${new Date(log.date).toLocaleString()}</td>
                    <td>${log.channel.toUpperCase()}</td>
                    <td>${log.type}</td>
                    <td>${log.recipient}</td>
                    <td><span class="status status-${log.status.toLowerCase()}">${log.status}</span></td>
                </tr>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

const form = document.getElementById('notyForm') as HTMLFormElement;
form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sendBtn = document.getElementById('sendBtn') as HTMLButtonElement;
    if (sendBtn) sendBtn.disabled = true;

    const payload = {
        type: (document.getElementById('type') as HTMLSelectElement).value,
        templateKey: (document.getElementById('templateKey') as HTMLSelectElement).value,
        lang: (document.getElementById('lang') as HTMLSelectElement).value,
        to: (document.getElementById('to') as HTMLInputElement).value,
        data: {
            name: (document.getElementById('userName') as HTMLInputElement).value,
            code: Math.floor(100000 + Math.random() * 900000).toString(),
            amount: (document.getElementById('amount') as HTMLInputElement).value || "0.00"
        }
    };

    try {
        const res = await fetch(`${API_URL}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert("¡Enviado!");
            form.reset();
            updateToFieldWithToken();
        }
    } catch (e) { alert("Error"); }
    finally { if (sendBtn) sendBtn.disabled = false; }
});

document.addEventListener('DOMContentLoaded', initFirebase);