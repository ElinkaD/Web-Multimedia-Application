const musicContainer = document.getElementById('window_track');
//buttons 
const playBtn = document.getElementById('play');
const play_cover = document.getElementById('play_cover');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
//шкала прогресса восприизведения аудио
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');

//меняющиеся элементы при переключание трека
const title = document.getElementById('title');
const cover = document.getElementById('cover');

const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

// Названия на смену
const songs = ['Imagine Dragons - Enemy (Feat. JID)', 'Ariana Grande - 7 rings', 'Король и Шут – Кукла колдуна'];

//Начальный трек
let songIndex = 0;

loadSong(songs[songIndex]);
//Функция обновления песни 
function loadSong(song){
    title.innerText = song;
    audio.src = `music/${song}.mp3`;
    cover.src = `img/${song}.jpg`;
}


//Проигрывать мелодию
function playSong(){
    musicContainer.classList.remove('pause');
    musicContainer.classList.add('play');
    play_cover.src = `img/icons/free-icon-font-pause-3917619.png`;
    if(!context){
        preparation();
    }
    audio.play();
}
//Пауза
function pauseSong(){
    musicContainer.classList.remove('play');
    musicContainer.classList.add('pause');
    play_cover.src = `img/icons/free-icon-font-play-3917607.png`;
    
    audio.pause();
}
//Назад
function prevSong(){
    songIndex--;
    if (songIndex < 0){
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}
//Вперед
function nextSong(){
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}


//визаулизация
const visual = document.getElementById('visual');
const canvas = document.getElementById('canvas1');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
//доступ к 2d элементам холста
const ctx = canvas.getContext('2d')

var context, analyser, src, array;
//функция визуализации трека, считывание частоты
function preparation(){
    context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 1024;
    array = new Uint8Array(analyser.frequencyBinCount);

    animate();
}
//запись полученной частоты в массивы
function animate(){
    const bufferlength = analyser.frequencyBinCount;
    const barWidth = canvas.width/bufferlength;
    let barHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(array);
    drawVisual(bufferlength, barWidth, barHeight, array);
    requestAnimationFrame(animate);
}
//анимация массива частот элементами canvas
function drawVisual(bufferlength, barWidth, barHeight, array){
    for(let i = 0; i < analyser.frequencyBinCount; i++){
        barHeight = array[i] * 3.5;
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2); //переносит начало координат холста в центр холста
        ctx.rotate(i + Math.PI * 2/ bufferlength); //поворот холста
        const red = i * barHeight/20;
        const blue = barHeight;
        const green = i * 5;
        ctx.fillStyle = 'rgb('+ red + ',' + green + ',' + blue + ')';
        ctx.fillRect(0, 0, barWidth, barHeight); //рисует прямоугольник на холсте
        ctx.restore();
    }
}


// Работа со шкалой воспроизведения трека
//Вычисляется процент прогресса воспроизведения медиафайла и шкала заполняется
function updateProgress(e){
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}
//Устанавливает прогресс воспроизведения аудиофайла при клике на прогресс-бар
function setProgress(e){
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}


//Запуски всех событий
//Нажатие на пуск или стоп
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');
    if(!isPlaying){
        playSong();
    }else{
        pauseSong();
    }
}); 
// Смена песни при клике
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

//Нажатие на шкалу трека
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('timeupdate', updateProgress);

// Смена трека при окончание 
audio.addEventListener('ended', nextSong);

