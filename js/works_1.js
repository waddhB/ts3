const sidebarBtn = document.querySelector('.sidebar_btn');
const sidebarIcon = document.querySelector('.sidebar_btn i');
const sidebar = document.querySelector('aside');
const logo = document.querySelector('.logo');
const miniLogo = document.querySelector('.small_logo');
const musicMenuHeadings = document.querySelectorAll('.music_menu h2');
const musicMenuParagraphs = document.querySelectorAll('.music_menu ul li a p');
const musicMenuItems = document.querySelectorAll('.music_menu ul li');

if (sidebarBtn && sidebarIcon && sidebar && logo && miniLogo) {
    sidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar_hide');
        sidebarIcon.classList.toggle('toggle_sidebar_btn');
        logo.classList.toggle('hide_element');
        miniLogo.classList.toggle('show_element');

        musicMenuHeadings.forEach(h2 => h2.classList.toggle('hide_element'));
        musicMenuParagraphs.forEach(p => p.classList.toggle('hide_element'));
        musicMenuItems.forEach(li => li.classList.toggle('menu_gap'));
    });
}
const songOption = document.querySelectorAll('.song_option');
songOption.forEach(option => {
    option.addEventListener('click', function (event) {
        event.stopPropagation();
        document.querySelectorAll('.song_option_dropdown').forEach(dropdown => {
            if (dropdown !== this.querySelector('.song_option_dropdown')) {
                dropdown.classList.remove('show_song_option');
            }
        });
        const dropdown = this.querySelector('.song_option_dropdown');
        dropdown.classList.toggle('show_song_option');
        const song = this.closest(".song_col");
        const src = song?.getAttribute("data-src");
        const downloadBtn = dropdown.querySelector(".download_option_icon");
        if (downloadBtn && src) {
            downloadBtn.parentElement.onclick = (e) => {
                e.stopPropagation();
                const link = document.createElement("a");
                link.href = src;
                link.download = src.split("/").pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        }
        const shareBtn = dropdown.querySelector(".share_option_icon");
        if (shareBtn && src) {
            shareBtn.parentElement.onclick = (e) => {
                e.stopPropagation();
                if (navigator.share) {
                    navigator.share({
                        title: song.dataset.title || "Listen to this song",
                        url: window.location.origin + "/" + src
                    });
                } else {
                    prompt("Copy the song URL:", window.location.origin + "/" + src);
                }
            };
        }
    });
});
document.addEventListener('click', function (event) {
    if (!event.target.closest('.song_option')) {
        document.querySelectorAll('.song_option_dropdown').forEach(dropdown => {
            dropdown.classList.remove('show_song_option');
        });
    }
});

const tab1 = document.querySelector('.tab1');
const tab2 = document.querySelector('.tab2');
const tab3 = document.querySelector('.tab3');
const songsWrapper1 = document.querySelector('.songs_wrapper1');
const songsWrapper2 = document.querySelector('.songs_wrapper2');
const songsWrapper3 = document.querySelector('.songs_wrapper3');

function setActiveTab(tab) {
    tab1.classList.remove('active_tab_list', 'active_song_list');
    tab2.classList.remove('active_tab_list', 'active_song_list');
    tab3.classList.remove('active_tab_list', 'active_song_list');

    songsWrapper1.classList.remove('show_songs');
    songsWrapper2.classList.remove('show_songs');
    songsWrapper3.classList.remove('show_songs');

    tab.classList.add('active_tab_list', 'active_song_list');
}

tab1.addEventListener('click', () => {
    setActiveTab(tab1);
    songsWrapper1.style.display = 'flex';
    songsWrapper1.classList.add('show_songs');
    songsWrapper2.style.display = 'none';
    songsWrapper3.style.display = 'none';
});

tab2.addEventListener('click', () => {
    setActiveTab(tab2);
    songsWrapper1.style.display = 'none';
    songsWrapper2.style.display = 'flex';
    songsWrapper2.classList.add('show_songs');
    songsWrapper3.style.display = 'none';
});

tab3.addEventListener('click', () => {
    setActiveTab(tab3);
    songsWrapper1.style.display = 'none';
    songsWrapper2.style.display = 'none';
    songsWrapper3.style.display = 'flex';
    songsWrapper3.classList.add('show_songs');
});
const audio = document.getElementById("audio_player");
const playBtn = document.querySelector(".play_button i");
const playButton = document.querySelector(".play_button");
const prevBtn = document.querySelector(".music_option_prev");
const nextBtn = document.querySelector(".music_option_next");
const seekSlider = document.querySelector(".seek_slider");
const volumeSlider = document.querySelector(".volume_slider");
const muteButton = document.querySelector(".mute_button i");
const currentTimeDisplay = document.querySelector(".current_time");
const durationDisplay = document.querySelector(".total_duration");
const songCover = document.querySelector(".song_cover");
const songTitle = document.querySelector(".song_info_box h3");
const songArtist = document.querySelector(".song_info_box p");
const songItems = document.querySelectorAll(".song_col");
const searchBox = document.querySelector(".search_box input");

songItems.forEach(item => {
    const heartIcon = item.querySelector(".ri-heart-2-line");
    if (heartIcon) heartIcon.style.display = "none";
});

let currentSongIndex = 0;
let isPlaying = false;
let savedTime = 0;

function playSongByIndex(index) {
    const song = songItems[index];
    if (!song) return;

    songTitle.textContent = song.dataset.title || "";
    songArtist.textContent = song.dataset.artist || "";
    songCover.src = song.dataset.cover || "";

    if (song.dataset.src) {
        audio.src = song.dataset.src;
        audio.currentTime = 0;
        audio.play();
        isPlaying = true;
        playBtn.classList.replace("fa-play", "fa-pause");
    }

    songItems.forEach(item => item.classList.remove("playing_song"));
    song.classList.add("playing_song");
    currentSongIndex = index;
}

playButton.addEventListener("click", () => {
    if (!isPlaying && audio.paused) {
        if (audio.src && audio.duration > 0) {
            audio.currentTime = savedTime;
            audio.play();
        } else {
            const activeWrapper = document.querySelector('.songs_wrapper.show_songs');
            if (!activeWrapper) return;

            const visibleSongs = Array.from(activeWrapper.querySelectorAll('.song_col')).filter(song => {
                return window.getComputedStyle(song).display !== 'none';
            });

            if (visibleSongs.length > 0) {
                const firstVisible = visibleSongs[0];
                currentSongIndex = Array.from(songItems).indexOf(firstVisible);
                savedTime = 0;
                playSongByIndex(currentSongIndex);
            }
        }
    } else {
        if (audio.src) {
            if (audio.paused) {
                audio.play();
            } else {
                savedTime = audio.currentTime;
                audio.pause();
            }
        }
    }
});

audio.addEventListener("play", () => {
    isPlaying = true;
    playBtn.classList.replace("fa-play", "fa-pause");
    songItems.forEach(item => item.classList.remove("playing_song"));
    if (songItems[currentSongIndex]) {
        songItems[currentSongIndex].classList.add("playing_song");
    }
});

audio.addEventListener("pause", () => {
    isPlaying = false;
    savedTime = audio.currentTime;
    playBtn.classList.replace("fa-pause", "fa-play");
});

audio.addEventListener("timeupdate", () => {
    seekSlider.value = (audio.currentTime / audio.duration) * 100 || 0;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    durationDisplay.textContent = formatTime(audio.duration);
});

seekSlider.addEventListener("input", () => {
    audio.currentTime = (seekSlider.value / 100) * audio.duration;
});

volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
    muteButton.classList.toggle("fa-volume-mute", audio.volume === 0);
    muteButton.classList.toggle("fa-volume-up", audio.volume > 0);
});

muteButton.parentElement.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteButton.classList.toggle("fa-volume-mute", audio.muted);
    muteButton.classList.toggle("fa-volume-up", !audio.muted);
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60) || 0;
    const secs = Math.floor(seconds % 60) || 0;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

songItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        savedTime = 0;
        if (currentSongIndex === index && isPlaying) {
            audio.pause();
        } else if (currentSongIndex === index && !isPlaying) {
            audio.play();
        } else {
            playSongByIndex(index);
        }
    });
});

nextBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songItems.length;
    savedTime = 0;
    playSongByIndex(currentSongIndex);
});

prevBtn.addEventListener("click", () => {
    if (audio.currentTime < 5 && currentSongIndex > 0) {
        currentSongIndex--;
    }
    savedTime = 0;
    playSongByIndex(currentSongIndex);
});

audio.addEventListener("ended", () => {
    currentSongIndex = (currentSongIndex + 1) % songItems.length;
    savedTime = 0;
    playSongByIndex(currentSongIndex);
});
function normalizeArabic(text) {
    if (!text) return '';
    return text
        .replace(/[أإآٱء]/g, 'ا')
        .replace(/[ى]/g, 'ي')
        .replace(/[ة]/g, 'ه')
        .replace(/[ؤئ]/g, 'ء')
        .replace(/[ﻻﻹﻷﻵ]/g, 'لا');
}

searchBox?.addEventListener("input", () => {
    const term = normalizeArabic(searchBox.value.trim().toLowerCase());
    const allSongWrappers = document.querySelectorAll('.songs_wrapper');
    
    allSongWrappers.forEach(wrapper => {
        const songs = wrapper.querySelectorAll(".song_col");
        let hasResults = false;
        
        songs.forEach((item) => {
            const title = normalizeArabic(item.dataset.title?.toLowerCase() || "");
            const artist = normalizeArabic(item.dataset.artist?.toLowerCase() || "");
            
            if (title.includes(term) || artist.includes(term)) {
                item.style.display = "flex";
                hasResults = true;
            } else {
                item.style.display = "none";
            }
        });
        
        const noResultsMsg = wrapper.querySelector(".no-results");
        if (!hasResults && term !== '') {
            if (!noResultsMsg) {
                const msgElement = document.createElement("p");
                msgElement.className = "no-results";
                msgElement.textContent = "لا توجد نتائج مطابقة للبحث";
                msgElement.style.cssText = `
                    text-align: center;
                    width: 100%;
                    padding: 20px;
                    color: #888;
                    font-family: 'Tajawal', sans-serif;
                    direction: rtl;
                `;
                wrapper.appendChild(msgElement);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll('.nav_item');
    const allWrappers = document.querySelectorAll('.songs_wrapper');
  
    allWrappers.forEach((wrapper, index) => {
        if (index === 0) {
            wrapper.style.display = 'flex';
            wrapper.classList.add('show_songs');
        } else {
            wrapper.style.display = 'none';
            wrapper.classList.remove('show_songs');
        }
    });
  
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetClass = item.getAttribute('data-target');
    
            navItems.forEach(el => el.classList.remove('active_link'));
            allWrappers.forEach(wrapper => {
                wrapper.style.display = 'none';
                wrapper.classList.remove('show_songs');
            });
    
            item.classList.add('active_link');
            const targetWrapper = document.querySelector(`.${targetClass}`);
            if (targetWrapper) {
                targetWrapper.style.display = 'flex';
                targetWrapper.classList.add('show_songs');
            }
        });
    });
});

const sid1ebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggle');

if (toggleBtn && sid1ebar) {
    toggleBtn.addEventListener('click', () => {
        sid1ebar.classList.toggle('closed');
        const icon = toggleBtn.querySelector('i');
        document.body.classList.toggle('sidebar_closed');
        if (sid1ebar.classList.contains('closed')) {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const activeWrapper = document.querySelector('.songs_wrapper.show_songs');
    if (!activeWrapper) return;

    const visibleSongs = Array.from(activeWrapper.querySelectorAll('.song_col')).filter(song => {
        return window.getComputedStyle(song).display !== 'none';
    });

    if (visibleSongs.length === 0) return;

    const firstSong = visibleSongs[0];
    const index = Array.from(songItems).indexOf(firstSong);
    if (index === -1) return;

    audio.muted = true;
    playSongByIndex(index);

    audio.addEventListener("loadeddata", function autoPause() {
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
            isPlaying = false;
            playBtn.classList.replace("fa-pause", "fa-play");
            audio.removeEventListener("loadeddata", autoPause);
        }, 300);
    });
});