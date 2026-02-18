const API_URL = 'http://localhost:3000/api/notifications';
let successChart = null;
let channelChart = null;
let currentToken = "";
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
        const app = window.firebase.initializeApp(firebaseConfig);
        const messaging = window.firebase.messaging();
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
                const toInput = document.getElementById('to');
                const typeSelect = document.getElementById('type');
                if (typeSelect.value === 'push')
                    toInput.value = token;
            }
        }
    }
    catch (e) {
        console.error(e);
    }
}
const typeSelect = document.getElementById('type');
const toInput = document.getElementById('to');
typeSelect?.addEventListener('change', () => {
    if (typeSelect.value === 'push') {
        toInput.value = currentToken;
        toInput.placeholder = "FCM Token (Auto)";
    }
    else if (typeSelect.value === 'email') {
        toInput.value = "";
        toInput.placeholder = "user@example.com";
    }
    else {
        toInput.value = "";
        toInput.placeholder = "+123456789";
    }
});
window.showSection = (sectionId) => {
    document.querySelectorAll('.main-content section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById(`section-${sectionId}`)?.classList.remove('hidden');
    document.getElementById(`btn-${sectionId}`)?.classList.add('active');
    if (sectionId === 'stats')
        updateCharts();
    if (sectionId === 'logs')
        loadLogs();
};
async function updateCharts() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        const stats = await res.json();
        setTimeout(() => {
            const ctxS = document.getElementById('successChart').getContext('2d');
            const ctxC = document.getElementById('channelChart').getContext('2d');
            if (successChart)
                successChart.destroy();
            successChart = new window.Chart(ctxS, {
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
            if (channelChart)
                channelChart.destroy();
            channelChart = new window.Chart(ctxC, {
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
        }, 50);
    }
    catch (e) {
        console.error(e);
    }
}
async function loadLogs() {
    try {
        const res = await fetch(`${API_URL}/logs`);
        const logs = await res.json();
        const body = document.getElementById('logsTableBody');
        if (body) {
            body.innerHTML = logs.map((log) => `
                <tr>
                    <td>${new Date(log.date).toLocaleString()}</td>
                    <td>${log.channel.toUpperCase()}</td>
                    <td>${log.type}</td>
                    <td>${log.recipient}</td>
                    <td><span class="status status-${log.status.toLowerCase()}">${log.status}</span></td>
                </tr>
            `).join('');
        }
    }
    catch (e) {
        console.error(e);
    }
}
const form = document.getElementById('notyForm');
form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    const payload = {
        type: document.getElementById('type').value,
        templateKey: document.getElementById('templateKey').value,
        lang: document.getElementById('lang').value,
        to: document.getElementById('to').value,
        data: {
            name: document.getElementById('userName').value,
            code: Math.floor(100000 + Math.random() * 900000).toString(),
            amount: document.getElementById('amount').value || "0.00"
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
            if (document.getElementById('type').value === 'push') {
                document.getElementById('to').value = currentToken;
            }
        }
    }
    catch (e) {
        alert("Error");
    }
    finally {
        sendBtn.disabled = false;
    }
});
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
});
