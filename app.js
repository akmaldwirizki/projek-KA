// Inisialisasi fitur Speech Recognition bawaan browser
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
    recognition.continuous = true; // Rekam terus menerus sampai dihentikan
    recognition.interimResults = false; // Hanya ambil hasil akhir kalimat
    recognition.lang = 'id-ID'; // Set bahasa ke Indonesia

    // Ketika suara berhasil diubah jadi teks
    recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript + ' ';
        }
        // Tambahkan teks baru ke dalam box transkrip
        transcriptionResult.value += currentText;
    };

    recognition.onerror = (event) => {
        console.error("Error perekaman: ", event.error);
        statusText.innerText = "Status: Terjadi kesalahan perekaman.";
    };

    recognition.onend = () => {
        statusText.innerText = "Status: Rekaman berhenti.";
    };

} else {
    alert("Maaf, browsermu tidak mendukung fitur rekam suara langsung. Gunakan Google Chrome/Edge terbaru.");
}

// Tombol Mulai Rekam
startBtn.addEventListener('click', () => {
    if (recognition && !isRecording) {
        recognition.start();
        isRecording = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        saveBtn.disabled = true;
        statusText.innerText = "Status: Mendengarkan rapat... 🎙️";
    }
});

// Tombol Berhenti Rekam
stopBtn.addEventListener('click', () => {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        saveBtn.disabled = false;
        statusText.innerText = "Status: Rekaman selesai. Memproses AI...";
        
        // Simulasi memanggil AI untuk rangkuman (Nanti kita ganti dengan API Key betulan)
        panggilAIKesimpulan();
    }
});

// Fungsi Simulasi AI Kesimpulan
function panggilAIKesimpulan() {
    summaryResult.value = "Menghubungkan ke AI...\n\n(Nanti di sini teks transkrip di atas akan dikirim ke API AI, lalu AI akan mengembalikan teks berupa kesimpulan rapat, poin keputusan, dan action plan secara otomatis).";
}

// Tombol Simpan Hasil (Fitur download file teks sederhana dulu)
saveBtn.addEventListener('click', () => {
    const teksYangDisimpan = `--- HASIL RAPAT ---\n\n[TRANSKRIP]:\n${transcriptionResult.value}\n\n[KESIMPULAN AI]:\n${summaryResult.value}`;
    const blob = new Blob([teksYangDisimpan], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Hasil_Rapat_${new Date().toLocaleDateString()}.txt`;
    link.click();
});
