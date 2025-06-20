const songs = [
    {
        title: "Jo Tere Sang",
        artist: "Jeet Ganguli",
        src: "music/1.mp3",
        cover: "albumcover/1.jpeg"
    },
    {
        title: "Nayan Ne Band Rakhi Ne",
        artist: "Darshan Raval",
        src: "music/2.mp3",
        cover: "albumcover/2.jpeg"
    },
    {
        title: "Badnam Gabru",
        artist: "Masoom Sharma",
        src: "music/3.mp3",
        cover: "albumcover/3.jpg"
    },
    {
        title: "Aam Jaahe Munde",
        artist: "Parmish Verma",
        src: "music/4.mp3",
        cover: "albumcover/4.jpg"
    },
    {
        title: "Bajrang Baan",
        artist: "All",
        src: "music/5.mp3",
        cover: "albumcover/5.jpg"
    },
    {
        title: "Mahabharat",
        artist: "Star Plus",
        src: "music/6.mp3",
        cover: "albumcover/6.jpeg"
    },
    {
        title: "Shiva Tandav Stotram",
        artist: "Shankar Mahadevan",
        src: "music/7.mp3",
        cover: "albumcover/7.jpg"
    },
    {
        title: "Maan Meri Jaan",
        artist: "King",
        src: "music/8.mp3",
        cover: "albumcover/8.jpeg"
    },
    {
        title: "Maa",
        artist: "Priya Saraiya",
        src: "music/9.mp3",
        cover: "albumcover/9.jpeg"
    },
    {
        title: "Papa",
        artist: "Udit Narayan",
        src: "music/10.mp3",
        cover: "albumcover/10.jpg"
    }
];

// DOM Elements
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const repeatBtn = document.getElementById('repeatBtn');
const volumeControl = document.getElementById('volumeControl');
const volumeLevel = document.getElementById('volumeLevel');
const playlist = document.getElementById('playlist');

const audio = new Audio();
let currentSongIndex = 0;
let isRepeat = false;

function initPlayer() {
    loadSong(currentSongIndex);
    renderPlaylist();

    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    repeatBtn.addEventListener('click', toggleRepeat);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleSongEnd);
    progress.addEventListener('click', setProgress);
    volumeControl.addEventListener('click', setVolume);

    audio.volume = 0.7;
    volumeLevel.style.width = `${audio.volume * 100}%`;
}

function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    albumArt.querySelector('img').src = song.cover;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;

    // Highlight active song in playlist
    const playlistItems = playlist.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Change background for each song (optional, can customize)
    document.body.style.background = `linear-gradient(135deg, #1a2a6c, #${(index+1)*111111 % 0xffffff
        .toString(16)
        .padStart(6, '0')}, #1a2a6c)`;
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.animation = 'gradientBG 15s ease infinite';
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '⏸';
        albumArt.classList.add('playing');
    } else {
        audio.pause();
        playBtn.innerHTML = '▶';
        albumArt.classList.remove('playing');
    }
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    audio.play();
    playBtn.innerHTML = '⏸';
    albumArt.classList.add('playing');
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playBtn.innerHTML = '⏸';
    albumArt.classList.add('playing');
}

function handleSongEnd() {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong();
    }
}

function updateProgress() {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / width;
    audio.volume = volume;
    volumeLevel.style.width = `${volume * 100}%`;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function renderPlaylist() {
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.classList.add('playlist-item');
        if (index === currentSongIndex) {
            playlistItem.classList.add('active');
        }

        playlistItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="playlist-item-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
        `;

        playlistItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            audio.play();
            playBtn.innerHTML = '⏸';
            albumArt.classList.add('playing');
        });

        playlist.appendChild(playlistItem);
    });
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active-repeat', isRepeat);
}

window.addEventListener('DOMContentLoaded', initPlayer);
