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

  // session에 저장된 이름이 있으면 바로 시작
  const savedName = sessionStorage.getItem('friendName');
  if (savedName) {
    applyFriendName(savedName);
    document.getElementById('entry').style.display = 'none';
    changeNameBtn.style.display = 'block';
    startFireworks();
  }

  startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) return alert('이름을 입력해주세요!');
    sessionStorage.setItem('friendName', name);
    applyFriendName(name);
    document.getElementById('entry').style.display = 'none';
    changeNameBtn.style.display = 'block';
    startFireworks();
  });

  // 이름 바꾸기
  changeNameBtn.addEventListener('click', () => {
    sessionStorage.removeItem('friendName');
    document.getElementById('entry').style.display = 'flex';
    changeNameBtn.style.display = 'none';
    document.getElementById('ending')?.classList.remove('show');
    currentNoteIndex = 0;
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

let currentNoteIndex = 0;
let isDragging = false;
let lastNoteTime = 0;
const minNoteInterval = 100; // 100ms 간격 제한 (조절 가능)

// 🎵 다음 음 재생
function playNextNote() {
  const now = Date.now();
  if (now - lastNoteTime < minNoteInterval) return;

  if (currentNoteIndex >= melody.length) return;

  const note = melody[currentNoteIndex];
  synth.triggerAttackRelease(note, '8n');

  // 줄 흔들림
  document.querySelectorAll('.string').forEach(s => s.classList.add('playing'));
  setTimeout(() => {
    document.querySelectorAll('.string').forEach(s => s.classList.remove('playing'));
  }, 200);

  // 조명
  const light = document.querySelector('.guitar-light');
  light.classList.add('on');
  setTimeout(() => light.classList.remove('on'), 200);

  // 음표 이펙트
  spawnNoteEmoji();

  currentNoteIndex++;
  lastNoteTime = now; // 마지막 재생 시각 기록

  // 🎉 엔딩
  if (currentNoteIndex >= melody.length) {
    setTimeout(() => {
      document.getElementById('ending').classList.add('show');
    }, 600); // 약간 여유 있게
}
}

// 🎸 드래그 감지
const guitar = document.querySelector('.guitar');

guitar.addEventListener('mousedown', () => {
  isDragging = true;
  currentNoteIndex = 0;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  currentNoteIndex = 0;
});

guitar.addEventListener('touchstart', () => {
  isDragging = true;
  currentNoteIndex = 0;
});

document.addEventListener('touchend', () => {
  isDragging = false;
  currentNoteIndex = 0;
});

// 🎯 줄 위로 지나갈 때 한 음씩
document.querySelectorAll('.string').forEach((string) => {
  string.addEventListener('mouseover', () => {
    if (isDragging) playNextNote();
  });

  string.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (isDragging && target === string) {
      playNextNote();
    }
  }, { passive: false });
});

function spawnNoteEmoji() {
  const note = document.createElement('div');
  note.textContent = '🎵';
  note.style.position = 'absolute';
  note.style.left = Math.random() * window.innerWidth + 'px';
  note.style.top = '80%';
  note.style.fontSize = '24px';
  note.style.opacity = 1;
  note.style.transition = 'all 1.5s ease-out';
  document.body.appendChild(note);

  requestAnimationFrame(() => {
    note.style.top = '30%';
    note.style.opacity = 0;
  });

  setTimeout(() => {
    document.body.removeChild(note);
  }, 1500);
}

document.getElementById('restartBtn').addEventListener('click', () => {
  // 상태 초기화
  currentNoteIndex = 0;
  isDragging = false;

  // 엔딩 숨기기
  document.getElementById('ending').classList.remove('show');
});

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
