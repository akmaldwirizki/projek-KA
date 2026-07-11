// --- LOGIKA TEMA (DARK/LIGHT MODE) ---
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Cek preferensi tema user di local storage saat halaman dimuat
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.classList.add(currentTheme);
}

themeToggle.addEventListener('click', () => {
    // Toggle kelas .dark-mode pada body
    body.classList.toggle('dark-mode');
    
    // Simpan preferensi user di local storage
    let theme = 'light-mode';
    if (body.classList.contains('dark-mode')) {
        theme = 'dark-mode';
    }
    localStorage.setItem('theme', theme);
});


// --- LOGIKA PEREKAMAN SUARA (Sama seperti sebelumnya, hanya ganti teks status) ---

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let isRecording = false;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusText = document.getElementById('status');
const transcriptionResult = document.getElementById('transcriptionResult');
const summaryResult = document.getElementById('summaryResult');
const saveBtn = document.getElementById('saveBtn');

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'id-ID';

    recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript + ' ';
        }
        transcriptionResult.value += currentText;
    };

    recognition.onerror = (event) => {
        console.error("Error perekaman: ", event.error);
        statusText.innerText = "Terjadi Kesalahan";
        statusText.className = "status-value status-ready"; // Reset warna
    };

    recognition.onend = () => {
        if (isRecording) {
            recognition.start(); // Restart jika berhenti tak sengaja saat masih mode rekam
        } else {
            statusText.innerText = "Selesai";
            statusText.className = "status-value status-ready";
        }
    };

} else {
    alert("Browser tidak mendukung fitur perekaman suara langsung. Gunakan Chrome/Edge terbaru.");
}

startBtn.addEventListener('click', () => {
    if (recognition && !isRecording) {
        recognition.start();
        isRecording = true;
        
        // Update UI
        startBtn.disabled = true;
        stopBtn.disabled = false;
        saveBtn.disabled = true;
        
        statusText.innerText = "Sedang Merekam...";
        statusText.className = "status-value status-recording"; // Ganti warna jadi merah pulse
    }
});

stopBtn.addEventListener('click', () => {
    if (recognition && isRecording) {
        isRecording = false; // Set flag dulu agar tidak autorestart di onend
        recognition.stop();
        
        // Update UI
        startBtn.disabled = false;
        stopBtn.disabled = true;
        saveBtn.disabled = false;
        
        statusText.innerText = "Memproses Ringkasan AI...";
        statusText.className = "status-value status-ready";
        
        panggilAIKesimpulan();
    }
});

function panggilAIKesimpulan() {
    summaryResult.value = "Menghubungkan ke layanan AI untuk analisis...\n\n[Placeholder]: Di sini teks transkrip akan dikirim ke API AI, lalu AI akan mengembalikan poin-poin penting, keputusan rapat, dan daftar tindakan (action items) secara otomatis.";
}

saveBtn.addEventListener('click', () => {
    const tanggal = new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
    const teksYangDisimpan = `--- DOKUMEN HASIL RAPAT ---\nTanggal: ${tanggal}\n\n[1. TRANSKRIP MENTAH]\n${transcriptionResult.value}\n\n[2. RINGKASAN EKSEKUTIF AI]\n${summaryResult.value}`;
    const blob = new Blob([teksYangDisimpan], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Notulensi_Rapat_${tanggal}.txt`;
    link.click();
});
