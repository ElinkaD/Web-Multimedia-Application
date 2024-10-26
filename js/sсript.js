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
const songs = ['The Hatters - Танцы', 'John Williams - OST Harry Potter', 'Cream Soda - Розовый Фламинго','Eyes On Fire OST Sumerki', 'Slava Marlow - Я не могу тебя найти']

const backgrounds = [
    { 
        bodyColor: 'linear-gradient(0deg, #f2e163 23.8%, #D99C79 92%)', 
        playerColor: 'rgb(242, 233, 223)', 
        colorFrequency: ['rgb(242, 233, 223)','#F2E163', '#D99C79', '#A3553F', '#FFD700', '#FFB14D', '#8B4513'] 
    }, 
    { 
        bodyColor: 'linear-gradient(0deg, rgb(0, 0, 50) 23.8%, rgb(100, 100, 150) 92%)', 
        playerColor: 'rgb(180, 180, 200)', 
        colorFrequency: ['#000032', '#646496', '#C0C0E0', '#A0A0D1', '#8B8B99', '#707070'] 
    }, 
    { 
        bodyColor: 'linear-gradient(0deg, rgb(255, 182, 193) 23.8%, rgb(255, 105, 180) 92%)', 
        playerColor: 'rgb(255, 240, 245)', 
        colorFrequency: ['#FFB6C1', '#FF69B4', '#FF1493', '#F48FB1', '#F06292', '#EC407A', '#D81B60', '#AD1457', '#880E4F', '#FCE4EC'] 
    }, 
    { 
        bodyColor: 'linear-gradient(0deg, rgb(50, 50, 50) 23.8%, #8EBFAD 92%)', 
        playerColor: 'rgb(80, 80, 80)', 
        colorFrequency: ['#323232', '#8EBFAD', '#D3D3D3', '#607D8B', '#455A64', '#78909C', '#CFD8DC', '#546E7A', '#37474F', '#263238'] 
    }, 
    { 
        bodyColor: 'linear-gradient(0deg, #0D0807 23.8%, #F24C3D 92%)', 
        playerColor: 'rgb(242, 172, 87)', 
        colorFrequency: ['#0D0807', '#F24C3D', '#F2AC57', '#FF6F00', '#FF8F00', '#FFA000', '#FFB300', '#FFC107', '#FFD54F', '#FFF176'] 
    }
];



//Начальный трек
let songIndex = 0;

loadSong(songs[songIndex], songIndex);
//Функция обновления песни 
function loadSong(song, index){
    title.innerText = song;
    audio.src = `music/${song}.mp3`;
    cover.src = `img/${song}.jpg`;

    document.body.style.backgroundImage = backgrounds[index].bodyColor;
    musicContainer.style.backgroundColor = backgrounds[index].playerColor;
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
    loadSong(songs[songIndex], songIndex);
    playSong();
}
//Вперед
function nextSong(){
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex], songIndex);
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
    const barWidth = canvas.width/bufferlength * 1.5;
    let barHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(array);
    drawVisual(bufferlength, barWidth, barHeight, array);
    requestAnimationFrame(animate);
}

function drawVisual(bufferlength, barWidth, barHeight, array){
    for(let i = 0; i < analyser.frequencyBinCount; i++){
        barHeight = array[i] * 3.5;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2); 
        ctx.rotate(i + Math.PI * 2 / bufferlength);

        // Получаем цвет из массива colorFrequency для текущей частоты
        const colors = backgrounds[songIndex].colorFrequency;
        const colorIndex = i % colors.length; // Используем цвета циклично
        let newColor = colors[colorIndex]; // Берем цвет из массива

        // Применяем цвет для визуализации столбца
        ctx.fillStyle = newColor;
        ctx.fillRect(0, 0, barWidth, barHeight);
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

