
window.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('nameInput');
  const startBtn = document.getElementById('startBtn');
  const dateDisplay = document.getElementById('date-display');
  const changeNameBtn = document.getElementById('changeNameBtn');

  // 오늘 날짜 넣기
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  dateDisplay.textContent = `${month}월 ${date}일`;

  // session에 저장된 이름이 있으면 그대로 보여주되, 재생은 버튼 클릭 시
  const savedName = sessionStorage.getItem('friendName');
  if (savedName) {
    nameInput.value = savedName;
  }

  startBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (!name) return alert('이름을 입력해주세요!');
    sessionStorage.setItem('friendName', name);
    applyFriendName(name);
    document.getElementById('entry').style.display = 'none';
    changeNameBtn.style.display = 'block';
    startFireworks();

    await Tone.start(); // 중요!
    melodyIndex = 0;
    playMelodyBGM();
  });

  changeNameBtn.addEventListener('click', () => {
    sessionStorage.removeItem('friendName');
    document.getElementById('entry').style.display = 'flex';
    changeNameBtn.style.display = 'none';
    document.getElementById('ending')?.classList.remove('show');
  });
});

function applyFriendName(name) {
  document.querySelectorAll('.friend-name').forEach(el => {
    el.textContent = name;
  });
}

const synth = new Tone.Synth().toDestination();

const melody = [
  "C4", "C4", "D4", "C4", "F4", "E4",
  "C4", "C4", "D4", "C4", "G4", "F4",
  "C4", "C4", "C5", "A4", "F4", "E4", "D4",
  "Bb4", "Bb4", "A4", "F4", "G4", "F4"
];

let melodyIndex = 0;

function playMelodyBGM() {
  if (melodyIndex >= melody.length) {
    document.getElementById('ending')?.classList.add('show');
    return;
  }

  const note = melody[melodyIndex];
  synth.triggerAttackRelease(note, '8n');

  document.querySelectorAll('.string').forEach(s => s.classList.add('playing'));
  setTimeout(() => {
    document.querySelectorAll('.string').forEach(s => s.classList.remove('playing'));
  }, 200);

  melodyIndex++;
  setTimeout(playMelodyBGM, 400);
}

function startFireworks() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > animationEnd) return clearInterval(interval);

    confetti({
      particleCount: 50,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    });
  }, 300);
}
