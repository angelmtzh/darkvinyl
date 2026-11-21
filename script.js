// DARK VINYL - Lógica de navegación, búsqueda y reproducción.

const musicDB = {
    pop: {
        name: "Pop", desc: "Melodías modernas y producción estelar", symbol: "⚡",
        artists: [
            { name: "Billie Eilish", img: "imagenes/l.jpg", featuredImg: "imagenes/l.jpg", albumImages: {"WHEN WE ALL FALL ASLEEP": "imagenes/ab.jpg", "HIT ME HARD AND SOFT": "imagenes/f.jpg"}, albums: {
                "WHEN WE ALL FALL ASLEEP": ["Bad Guy", "Bury a Friend", "All the Good Girls"],
                "HIT ME HARD AND SOFT": ["WILDFLOWER", "CHIHIRO", "BIRDS OF A FEATHER"]
            }},
            { name: "Mon Laferte", img: "imagenes/m.jpeg", featuredImg: "imagenes/m.jpeg", albumImages: {"La Trenza": "imagenes/la.jpg", "Mon Laferte (Vol.1)": "imagenes/vo.jpg"}, albums: {
                "La Trenza": ["La Trenza", "Mi Buen Amor", "Pa Dónde Se Fue"],
                "Mon Laferte (Vol.1)": ["Amor Completo", "Tu Falta De Querer", "Si Tu Me Quisieras"]
            }}
        ]
    },
    rock: {
        name: "Rock", desc: "Guerreros del riff y energía eléctrica", symbol: "🎸",
        artists: [
            { name: "Arctic Monkeys", img: "imagenes/am.jpg", featuredImg: "imagenes/am.jpg", albumImages: {"AM": "imagenes/arb.jpg", "Favourite Worst Nightmare": "imagenes/aa.jpg"}, albums: {
                "AM": ["Do I Wanna Know?", "R U Mine?", "I Wanna Be Yours"],
                "Favourite Worst Nightmare": ["Teddy Picker", "Fluorescent Adolescent", "Do Me a Favour"]
            }},
            { name: "The Rare Occasions", img: "imagenes/r.jpeg", featuredImg: "imagenes/r.jpeg", albumImages: {"Big Whoop": "imagenes/ts.jpg", "Notion": "imagenes/tb.jpg"}, albums: {
                "Big Whoop": ["Alone", "Control", "Origami"],
                "Notion": ["Notion"]
            }}
        ]
    },
    folk: {
        name: "Folk", desc: "Acústica pura y relatos bohemios", symbol: "🌾",
        artists: [
            { name: "Ed Maverick", img: "imagenes/ed.jpg", albumImages: {"Mix pa Llorar en tu Cuarto": "imagenes/me.jpg", "La Nube en el Jardin": "imagenes/eb.jpg"}, albums: {
                "Mix pa Llorar en tu Cuarto": ["Fuentes de Ortiz", "Acurrucar", "Quiero"],
                "La Nube en el Jardin": ["No Hay Problema", "Valor de Más", "Violento"]
            }},
            { name: "Kevin Kaarl", img: "imagenes/k.jpg", albumImages: {"Hasta el Fin del Mundo": "imagenes/kb.jpg", "Paris Texas": "imagenes/pk.jpg"}, albums: {
                "Hasta el Fin del Mundo": ["Vámonos a Marte", "Colapso", "San Lucas"],
                "Paris Texas": [" te quiero tanto", "Paris Texas", "Siento"]
            }}
        ]
    },
    regional: {
        name: "Regional", desc: "Tradición, cuerdas y sentimiento profundo", symbol: "🪗",
        artists: [
            { name: "Joan Sebastian", img: "imagenes/js.jpg", albumImages: {"Rumores": "imagenes/jb.jpg", "Secreto de Amor": "imagenes/se.jpg"}, albums: {
                "Rumores": ["El Ilegal", "Oiga", "Rumores"],
                "Secreto de Amor": ["Secreto de Amor", "Un Idiota", "Eso y Más"]
            }},
            { name: "Pedro Infante", img: "imagenes/p.jpg", albumImages: {"Cien Años": "imagenes/ci.jpg"}, albums: {
                "Cien Años": ["Cien Años"],
               
            }}
        ]
    },
    Baladas: {
        name: "Baladas", desc: "Romanticismo atemporal y nostalgia pura", symbol: "🌹",
        artists: [
            { name: "José José", img: "imagenes/jose.jpg", albumImages: {"Distancia": "imagenes/d.jpg", "Lo Pasado Pasado": "imagenes/jsb.jpg"}, albums: {
                "Distancia": ["Cariño", "Cómo duele", "Amar sin ser amado"],
                "Lo Pasado Pasado": ["El último beso", "Ahora no", "Almohada"]
            }},
            { name: "Juan Gabriel", img: "imagenes/j.jpg", albumImages: {"Recuerdos": "imagenes/ru.jpg"}, albums: {
                "Recuerdos": ["Recuerdos", "Yo No Nací Para Amar", "El Noa Noa"],
            }}
        ]
    }
};

// Acceso compatible al artista/álbum seleccionado dentro de cada género.
function getGenreArtists(genre) { return genre.artists || [{ name: genre.artist, img: genre.img, albums: genre.albums }]; }
function findArtist(genreKey, artistName) {
    const genre = musicDB[genreKey];
    return genre && getGenreArtists(genre).find(artist => artist.name === artistName);
}
function imageSlug(value) {
    return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
// PORTADAS DE ÁLBUMES: edita el nombre de cada archivo en albumImages, arriba.
function getAlbumCoverPath(artistName, albumName) {
    for (const genre of Object.values(musicDB)) {
        const artist = getGenreArtists(genre).find(item => item.name === artistName);
        if (artist) return artist.albumImages?.[albumName] || "imagenes/portada-pendiente.jpg";
    }
    return "imagenes/portada-pendiente.jpg";
}

// Variables para controlar la canción y el reproductor.
let au = null;
let currentGenreKey = "";
let currentArtistKey = "";
let currentAlbumKey = "";
let currentSongIndex = 0;
let currentSongList = [];

// Canciones rápidas que se muestran en la página de inicio, si existe ese contenedor.
const homeSongs = [
    { title: "El Triste", artist: "José José", duration: "4:16", genre: "Veladas", album: "El Triste" },
    { title: "Fuentes de Ortiz", artist: "Ed Maverick", duration: "3:42", genre: "folk", album: "Mix pa Llorar en tu Cuarto" },
    { title: "Do I Wanna Know?", artist: "Arctic Monkeys", duration: "4:32", genre: "rock", album: "AM" }
];

document.addEventListener("DOMContentLoaded", () => {
    // Obtener el elemento de audio que está definido en el HTML.
    au = document.getElementById("audio");

    // Respaldo por si el elemento de audio se elimina accidentalmente del HTML.
    if (!au) {
        au = document.createElement("audio");
        au.id = "audio";
        au.preload = "metadata";
        document.body.appendChild(au);
    }

    renderHomeArtists();
    renderHomeSongs();
    renderExploreGenres();
    initializeAudioEvents();
    updatePlayButton();

    const playerBar = document.getElementById("player-bar");
    if (playerBar) playerBar.classList.add("hidden");
});

function initializeAudioEvents() {
    if (!au) return;

    // El icono siempre refleja el estado REAL del audio.
    au.addEventListener("play", updatePlayButton);
    au.addEventListener("playing", updatePlayButton);
    au.addEventListener("pause", updatePlayButton);
    au.addEventListener("ended", () => {
        updatePlayButton();
        nextTrack();
    });

    au.addEventListener("loadedmetadata", updateTrackDuration);
    au.addEventListener("durationchange", updateTrackDuration);
    au.addEventListener("timeupdate", updateProgress);
    au.addEventListener("error", () => {
        updatePlayButton();
        console.error("No se pudo cargar el audio. Revisa que el archivo exista dentro de la carpeta canciones.");
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.toggle("closed");
}

function showSection(sectionId) {
    document.querySelectorAll(".section-view").forEach(section => {
        section.classList.remove("active-view");
    });

    const target = document.getElementById(`sec-${sectionId}`);
    if (target) target.classList.add("active-view");
}

// FOTOS DE ARTISTAS DESTACADOS: cambia featuredImg en cada artista por el nombre de tu archivo dentro de imagenes/.
function renderHomeArtists() {
    const grid = document.getElementById("home-artists-grid");
    if (!grid) return;
    let html = "";
    let featuredCount = 0;
    for (const [genreKey, genre] of Object.entries(musicDB)) {
        for (const artist of getGenreArtists(genre)) {
            if (featuredCount >= 4) break;
            html += `
                <div class="universal-card" onclick="openArtistAlbums('${genreKey}', '${artist.name}')">
                    <div class="marco-circular-premium"><img src="${artist.featuredImg || artist.img || 'imagenes/default.jpg'}" alt="${artist.name}" class="imagen-circular-interna"></div>
                    <div class="card-info-box"><h3>${artist.name}</h3><p>${genre.name}</p></div>
                </div>`;
            featuredCount++;
        }
        if (featuredCount >= 4) break;
    }
    grid.innerHTML = html;
}

function renderHomeSongs() {
    const box = document.getElementById("home-songs-grid");
    if (!box) return;

    box.innerHTML = homeSongs.map((song, index) => `
        <div class="row-item-track" onclick="playSongFromHome(${index})">
            <div class="row-index">${index + 1}</div>
            <div class="row-thumb"></div>
            <div class="row-details">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <span class="row-length">${song.duration}</span>
            <div class="row-action-icon">▶</div>
        </div>
    `).join("");
}

function renderExploreGenres() {
    const container = document.getElementById("genres-container");
    if (!container) return;

    let html = "";
    for (const [genreKey, genre] of Object.entries(musicDB)) {
        html += `
            <div class="genre-box-card" onclick="openGenre('${genreKey}')">
                <div class="genre-card-img"><span>${genre.symbol}</span></div>
                <div class="genre-card-body">
                    <h3>${genre.name}</h3>
                    <p>${genre.desc} — <strong>${getGenreArtists(genre).map(a => a.name).join(" y ")}</strong></p>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function openGenre(genreKey) {
    const genre = musicDB[genreKey];
    const dynamicContent = document.getElementById("dynamic-content");
    if (!genre || !dynamicContent) return;
    const artistCards = getGenreArtists(genre).map(artist => `
        <div class="universal-card" onclick="openArtistAlbums('${genreKey}', '${artist.name}')">
            <div class="artist-card-photo"><img src="${artist.img || 'imagenes/default.jpg'}" alt="${artist.name}"></div>
            <div class="card-info-box"><h3>${artist.name}</h3><p>Ver álbumes</p></div>
        </div>`).join("");
    dynamicContent.innerHTML = `
        <div class="detail-header-hero" style="margin-bottom:30px;"><div class="detail-titles"><h1>Género: ${genre.name}</h1><p>${genre.desc}</p></div></div>
        <div class="section-block"><h2>Artistas de ${genre.name}</h2><div class="cards-grid">${artistCards}</div></div>`;
    showSection("dynamic");
}

function openArtistAlbums(artistOrGenre, artistName) {
    let genreKey = artistOrGenre;
    if (!musicDB[genreKey]) {
        genreKey = Object.keys(musicDB).find(key => getGenreArtists(musicDB[key]).some(a => a.name === artistOrGenre));
        artistName = artistOrGenre;
    }
    const genre = musicDB[genreKey];
    const artist = genre && (artistName ? findArtist(genreKey, artistName) : getGenreArtists(genre)[0]);
    const dynamicContent = document.getElementById("dynamic-content");
    if (!genre || !artist || !dynamicContent) return;
    let html = `<div class="detail-header-hero" style="margin-bottom:30px;"><div class="detail-titles"><h1>Artista: ${artist.name}</h1><p>Género: ${genre.name}</p></div></div>
        <div class="section-block"><h2>Álbumes</h2><div class="cards-grid">`;
    for (const [albumName, songs] of Object.entries(artist.albums)) {
        html += `<div class="universal-card album-card" onclick="openAlbumSongs('${genreKey}', '${albumName}', '${artist.name}')">
            <div class="album-cover-square"><img src="${getAlbumCoverPath(artist.name, albumName)}" alt="Portada de ${albumName}"></div>
            <div class="card-info-box"><h3>${albumName}</h3><p>${songs.length} canciones · Ver canciones</p></div></div>`;
    }
    html += "</div></div>";
    dynamicContent.innerHTML = html;
    showSection("dynamic");
}

function openAlbumSongs(genreKey, albumName, artistName) {
    const targetGenre = musicDB[genreKey];
    const artist = targetGenre && (findArtist(genreKey, artistName) || getGenreArtists(targetGenre)[0]);
    const dynamicContent = document.getElementById("dynamic-content");
    if (!artist || !artist.albums[albumName] || !dynamicContent) return;
    currentGenreKey = genreKey;
    currentArtistKey = artist.name;
    currentAlbumKey = albumName;
    currentSongList = artist.albums[albumName];
    let html = `<div class="detail-header-hero" style="margin-bottom:30px;"><div class="detail-titles"><h1>Álbum: ${albumName}</h1><p>Artista: ${artist.name}</p></div></div>
        <div class="section-block"><h2>Canciones</h2><div class="tracks-rows">`;
    currentSongList.forEach((song, index) => {
        html += `<div class="row-item-track" onclick="playSong('${genreKey}', '${albumName}', ${index}, '${artist.name}')">
            <div class="row-index">${index + 1}</div><div class="row-thumb"></div>
            <div class="row-details"><h4>${song}</h4><p>${artist.name} — ${albumName}</p></div>
            <span class="row-length">3:45</span><div class="row-action-icon">▶</div></div>`;
    });
    html += "</div></div>";
    dynamicContent.innerHTML = html;
    showSection("dynamic");
}

function normalizeSearchText(value) {
    return String(value)
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function handleSearch(query) {
    const container = document.getElementById("genres-container");
    const noResults = document.getElementById("no-results-msg");
    if (!container) return;
    const search = normalizeSearchText(query.trim());
    if (!search) { renderExploreGenres(); if (noResults) noResults.classList.add("hidden"); return; }
    let resultsHtml = "", found = false;
    for (const [genreKey, genre] of Object.entries(musicDB)) {
        const artists = getGenreArtists(genre);
        const searchableText = normalizeSearchText([genre.name, genre.desc, ...artists.flatMap(a => [a.name, ...Object.keys(a.albums), ...Object.values(a.albums).flat()])].join(" "));
        if (searchableText.includes(search)) {
            found = true;
            resultsHtml += `<div class="genre-box-card" onclick="openGenre('${genreKey}')"><div class="genre-card-img"><span>${genre.symbol}</span></div><div class="genre-card-body"><h3>${genre.name}</h3><p>${genre.desc} — <strong>${artists.map(a => a.name).join(" y ")}</strong></p></div></div>`;
        }
    }
    container.innerHTML = resultsHtml;
    if (noResults) noResults.classList.toggle("hidden", found);
}

// Convierte el nombre de una canción en el nombre del archivo MP3.
// Ejemplo: "Do I Wanna Know?" -> "do-i-wanna-know.mp3".
function getAudioPath(songName) {
    const fileName = String(songName)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return `canciones/${fileName}.mp3`;
}

function setPlayerText(songName, artistName) {
    const title = document.getElementById("player-title");
    const artist = document.getElementById("player-artist");
    if (title) title.textContent = songName;
    if (artist) artist.textContent = artistName;
}

function showPlayer() {
    const playerBar = document.getElementById("player-bar");
    if (playerBar) playerBar.classList.remove("hidden");
}

function resetProgress() {
    const currentTime = document.getElementById("time-current");
    const totalTime = document.getElementById("time-total");
    const progressFill = document.getElementById("progress-fill");

    if (currentTime) currentTime.textContent = "0:00";
    if (totalTime) totalTime.textContent = "0:00";
    if (progressFill) progressFill.style.width = "0%";
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
}

function updatePlayButton() {
    const playButton = document.getElementById("play-btn");
    if (!playButton) return;

    const isPlaying = Boolean(au && !au.paused && !au.ended);
    playButton.textContent = isPlaying ? "∣∣" : "▶";
    playButton.setAttribute("aria-label", isPlaying ? "Pausar" : "Reproducir");
}

function updateTrackDuration() {
    if (!au) return;
    const totalTime = document.getElementById("time-total");
    if (totalTime) totalTime.textContent = formatTime(au.duration);
}

function updateProgress() {
    if (!au) return;

    const currentTime = document.getElementById("time-current");
    const progressFill = document.getElementById("progress-fill");
    if (currentTime) currentTime.textContent = formatTime(au.currentTime);

    if (progressFill) {
        const percentage = Number.isFinite(au.duration) && au.duration > 0
            ? (au.currentTime / au.duration) * 100
            : 0;
        progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    }
}

function startAudioPlayback() {
    if (!au || !au.getAttribute("src")) return;

    const playPromise = au.play();
    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(error => {
            updatePlayButton();
            console.warn("No se pudo iniciar la canción. Comprueba que el MP3 exista en la carpeta canciones.", error);
        });
    }
}

function playSong(genreKey, albumName, songIndex, artistName) {
    const targetGenre = musicDB[genreKey];
    const selectedArtist = targetGenre && (findArtist(genreKey, artistName || currentArtistKey) || getGenreArtists(targetGenre)[0]);
    if (!selectedArtist || !selectedArtist.albums[albumName]) return;

    const songs = selectedArtist.albums[albumName];
    if (!Number.isInteger(songIndex) || songIndex < 0 || songIndex >= songs.length) return;

    currentGenreKey = genreKey;
    currentArtistKey = selectedArtist.name;
    currentAlbumKey = albumName;
    currentSongList = songs;
    currentSongIndex = songIndex;

    const songName = songs[songIndex];
    const trackKey = `${genreKey}|${selectedArtist.name}|${albumName}|${songIndex}`;

    setPlayerText(songName, selectedArtist.name);
    showPlayer();

    // Si se selecciona la misma canción, no se reinicia: solo se reanuda si estaba pausada.
    if (au && au.dataset.trackKey === trackKey && au.getAttribute("src")) {
        if (au.paused) startAudioPlayback();
        updatePlayButton();
        return;
    }

    if (!au) return;

    au.pause();
    au.dataset.trackKey = trackKey;
    au.src = getAudioPath(songName);
    au.load();
    resetProgress();
    startAudioPlayback();
}

// Reproductor rápido para las canciones sugeridas de la página de inicio.
function playSongFromHome(songIndexOrTitle, artistName) {
    let selectedSong;

    if (Number.isInteger(songIndexOrTitle)) {
        selectedSong = homeSongs[songIndexOrTitle];
    } else {
        selectedSong = homeSongs.find(song =>
            song.title === songIndexOrTitle && (!artistName || song.artist === artistName)
        );
    }

    if (!selectedSong) return;

    const selectedArtist = findArtist(selectedSong.genre, selectedSong.artist);
    if (!selectedArtist) return;
    const songIndex = selectedArtist.albums[selectedSong.album].indexOf(selectedSong.title);
    playSong(selectedSong.genre, selectedSong.album, songIndex, selectedSong.artist);
}

function togglePlay() {
    if (!au || !au.getAttribute("src")) return;

    if (au.paused || au.ended) {
        if (au.ended) au.currentTime = 0;
        startAudioPlayback();
    } else {
        au.pause();
    }

    // Los eventos play/pause actualizan el icono; esta llamada cubre el cambio inmediato.
    updatePlayButton();
}

function nextTrack() {
    if (!currentSongList.length) return;

    currentSongIndex = (currentSongIndex + 1) % currentSongList.length;
    playSong(currentGenreKey, currentAlbumKey, currentSongIndex, currentArtistKey);
}

function prevTrack() {
    if (!currentSongList.length) return;

    currentSongIndex = (currentSongIndex - 1 + currentSongList.length) % currentSongList.length;
    playSong(currentGenreKey, currentAlbumKey, currentSongIndex, currentArtistKey);
}

function changeTrack(direction) {
    if (Number(direction) < 0) {
        prevTrack();
    } else {
        nextTrack();
    }
}

function seekAudio(event) {
    if (!au || !Number.isFinite(au.duration) || au.duration <= 0) return;

    const progressTrack = event.currentTarget;
    const bounds = progressTrack.getBoundingClientRect();
    if (!bounds.width) return;

    const clickPosition = event.clientX - bounds.left;
    const ratio = Math.min(1, Math.max(0, clickPosition / bounds.width));
    au.currentTime = ratio * au.duration;
}

// Cierra el reproductor, pausa el audio y reinicia la barra de progreso.
function closePlayer() {
    if (au) {
        au.pause();
        au.currentTime = 0;
        au.removeAttribute("src");
        delete au.dataset.trackKey;
        au.load();
    }

    const playerBar = document.getElementById("player-bar");
    if (playerBar) playerBar.classList.add("hidden");

    resetProgress();
    updatePlayButton();
}

function openVideoModal(title, duration) {
    // Al abrir un contenido de video, pausa la música para evitar que se encimen los audios.
    if (au && !au.paused) au.pause();
    updatePlayButton();

    const modal = document.getElementById("media-modal");
    const modalContent = document.getElementById("modal-inner-content");
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
        <h2 style="margin-bottom:15px; color:var(--col-beige);">${title}</h2>
        <div style="width:100%; height:230px; background:#000; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; border: 1px solid var(--col-borde);">
            <div class="play-circle-btn">▶</div>
        </div>
        <p style="color:#94a3b8; font-size:14px;">Duración: ${duration}</p>
    `;

    modal.classList.remove("hidden");
}

function closeModalWindow() {
    const modal = document.getElementById("media-modal");
    if (modal) modal.classList.add("hidden");
}

// EVITAR QUE SE REPRODUZCAN VARIOS AUDIOS O VÍDEOS AL MISMO TIEMPO
document.addEventListener("play", function(event) {

    const elementoActual = event.target;

    // Si comienza un vídeo, detener la música y los demás vídeos.
    if (elementoActual.tagName === "VIDEO") {

        const audio = document.getElementById("audio");

        if (audio) {
            audio.pause();
        }

        document.querySelectorAll("video").forEach(video => {
            if (video !== elementoActual) {
                video.pause();
            }
        });

        if (typeof updatePlayButton === "function") {
            updatePlayButton();
        }
    }

    // Si comienza una canción, detener todos los vídeos.
    if (elementoActual.tagName === "AUDIO") {

        document.querySelectorAll("video").forEach(video => {
            video.pause();
        });

    }

}, true);
















document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario");

    if (!form) return;

    // CAMPOS
    const nombre = document.getElementById("nombre");
    const paterno = document.getElementById("apellidoPaterno");
    const materno = document.getElementById("apellidoMaterno");
    const edad = document.getElementById("edad");
    const telefono = document.getElementById("telefono");
    const email = document.getElementById("email");

    const dia = document.getElementById("dia");
    const mes = document.getElementById("mes");
    const anio = document.getElementById("anio");

    let tocados = new Set();
    let fechaTocada = false;
    let enviado = false;

    // GENERAR DÍAS
    for (let d = 1; d <= 31; d++) {
        dia.add(new Option(d, d));
    }

    // GENERAR AÑOS
    const anioActual = new Date().getFullYear();

    for (let y = anioActual; y >= anioActual - 100; y--) {
        anio.add(new Option(y, y));
    }

    // MOSTRAR ERRORES
    function mostrarError(id, mensaje) {
        const campo = document.getElementById(id);
        const error = document.getElementById("error-" + id);

        if (error) error.textContent = mensaje;

        if (campo) {
            campo.classList.toggle("invalido", Boolean(mensaje));
            campo.classList.toggle(
                "valido",
                !mensaje && Boolean(campo.value.trim())
            );
        }
    }

    // NOMBRES Y APELLIDOS: SOLO LETRAS Y MAYÚSCULAS
    [nombre, paterno, materno].forEach(campo => {

        campo.addEventListener("input", () => {

            const inicio = campo.selectionStart;
            const fin = campo.selectionEnd;

            campo.value = campo.value
                .replace(/[^\p{L}\s'-]/gu, "")
                .toLocaleUpperCase("es-MX");

            campo.setSelectionRange(inicio, fin);

            tocados.add(campo.id);

            validarCampo(campo);
            validarTodoEnVivo();
        });

    });

    // EDAD Y TELÉFONO: SOLO NÚMEROS
    [edad, telefono].forEach(campo => {

        campo.addEventListener("input", () => {

            campo.value = campo.value.replace(/\D/g, "");

            if (campo === edad) campo.value = campo.value.slice(0, 3);
            if (campo === telefono) campo.value = campo.value.slice(0, 16);

            tocados.add(campo.id);

            validarCampo(campo);
            validarTodoEnVivo();
        });

    });

    // CALCULAR EDAD SEGÚN FECHA DE NACIMIENTO
    function calcularEdad() {

        const d = Number(dia.value);
        const m = Number(mes.value);
        const y = Number(anio.value);

        if (!d || !m || !y) return null;

        const nacimiento = new Date(y, m - 1, d);
        const hoy = new Date();

        if (
            nacimiento.getFullYear() !== y ||
            nacimiento.getMonth() !== m - 1 ||
            nacimiento.getDate() !== d ||
            nacimiento > hoy
        ) {
            return null;
        }

        let resultado = hoy.getFullYear() - y;

        if (
            hoy.getMonth() < m - 1 ||
            (hoy.getMonth() === m - 1 && hoy.getDate() < d)
        ) {
            resultado--;
        }

        return resultado;
    }

    // ACTUALIZAR DÍAS SEGÚN EL MES
    function actualizarDias() {

        const anterior = dia.value;
        const m = Number(mes.value);
        const y = Number(anio.value) || anioActual;

        const maximo = m ? new Date(y, m, 0).getDate() : 31;

        dia.innerHTML = '<option value="">Día</option>';

        for (let d = 1; d <= maximo; d++) {
            dia.add(new Option(d, d));
        }

        if (anterior && Number(anterior) <= maximo) {
            dia.value = anterior;
        }
    }

    // VALIDAR FECHA
    function validarFecha() {

        if (!dia.value || !mes.value || !anio.value) {
            return "Selecciona día, mes y año.";
        }

        if (calcularEdad() === null) {
            return "Selecciona una fecha válida.";
        }

        return "";
    }

    function mostrarErrorFecha() {

        const error = document.getElementById("error-fecha");
        const mensaje = validarFecha();

        if (error) {
            error.textContent =
                (fechaTocada || enviado) ? mensaje : "";
        }

        [dia, mes, anio].forEach(campo => {

            campo.classList.toggle(
                "invalido",
                Boolean(mensaje) && (fechaTocada || enviado)
            );

            campo.classList.toggle(
                "valido",
                !mensaje && Boolean(dia.value && mes.value && anio.value)
            );

        });
    }

    // VALIDAR CADA CAMPO
    function validarCampo(campo) {

        const valor = campo.value.trim();
        let mensaje = "";

        if (!valor) {
            mensaje = "Este campo es obligatorio.";
        }

        else if (
            ["nombre", "apellidoPaterno", "apellidoMaterno"].includes(campo.id)
        ) {

            if (!/^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u.test(valor)) {
                mensaje = "Escribe solamente letras.";
            }

        }

        else if (campo.id === "edad") {

            const numero = Number(valor);

            if (!/^\d+$/.test(valor) || numero < 1 || numero > 120) {
                mensaje = "Ingresa una edad válida.";
            } else {

                const edadReal = calcularEdad();

                if (edadReal === null) {
                    mensaje = "Selecciona primero tu fecha de nacimiento.";
                } else if (numero !== edadReal) {
                    mensaje = `Según tu fecha de nacimiento, tu edad es ${edadReal} años.`;
                }

            }

        }

        else if (campo.id === "telefono") {

            if (!/^\d{16}$/.test(valor)) {
                mensaje = "Ingresa un número de tarjeta valido.";
            }

        }

        else if (campo.id === "email") {

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                mensaje = "Ingresa un correo válido.";
            }

        }

        mostrarError(campo.id, mensaje);

        return !mensaje;
    }

    // VALIDACIÓN EN TIEMPO REAL
    function validarTodoEnVivo() {

        const campos = [
            nombre,
            paterno,
            materno,
            edad,
            telefono,
            email
        ];

        campos.forEach(campo => {

            if (tocados.has(campo.id) || enviado) {
                validarCampo(campo);
            }

        });

        if (fechaTocada || enviado) {
            mostrarErrorFecha();
        }
    }

    // VALIDAR AL SALIR DEL CAMPO
    [nombre, paterno, materno, edad, telefono, email]
        .forEach(campo => {

            campo.addEventListener("blur", () => {

                tocados.add(campo.id);
                validarCampo(campo);

            });

        });

    // CAMBIOS EN LA FECHA
    [dia, mes, anio].forEach(campo => {

        campo.addEventListener("change", () => {

            fechaTocada = true;

            if (campo === mes || campo === anio) {
                actualizarDias();
            }

            mostrarErrorFecha();

            if (edad.value) {
                tocados.add("edad");
                validarCampo(edad);
            }

        });

    });

    // ENVIAR SUSCRIPCIÓN
    form.addEventListener("submit", event => {

        event.preventDefault();

        enviado = true;
        fechaTocada = true;

        const campos = [
            nombre,
            paterno,
            materno,
            edad,
            telefono,
            email
        ];

        let valido = true;

        campos.forEach(campo => {

            tocados.add(campo.id);

            if (!validarCampo(campo)) {
                valido = false;
            }

        });

        if (validarFecha()) {
            valido = false;
        }

        mostrarErrorFecha();

        const mensaje = document.getElementById("mensaje-exito");

        if (mensaje) {
            mensaje.textContent = valido
                ? "¡Datos validados correctamente!"
                : "";
        }

        // SI TODO ES CORRECTO
        if (valido) {

            // MOSTRAR CONFIRMACIÓN
            const modal = document.getElementById("alerta-exito");

            if (modal) {
                modal.classList.add("mostrar");
            }

            // LIMPIAR TODOS LOS CAMPOS
            form.reset();

            // REINICIAR VALIDACIONES
            tocados.clear();
            enviado = false;
            fechaTocada = false;

            // QUITAR COLORES DE VALIDACIÓN
            form.querySelectorAll(".valido, .invalido")
                .forEach(campo => {
                    campo.classList.remove("valido", "invalido");
                });

            // LIMPIAR MENSAJES
            form.querySelectorAll(".error").forEach(error => {
                error.textContent = "";
            });

            if (mensaje) {
                mensaje.textContent = "";
            }

        }

    });

});

// CERRAR VENTANA DE CONFIRMACIÓN
function cerrarAlerta() {

    const modal = document.getElementById("alerta-exito");

    if (modal) {
        modal.classList.remove("mostrar");
    }

}

// Permite que los enlaces del menú desde formulario.html abran la sección indicada en index.html.
document.addEventListener("DOMContentLoaded", () => {
    const section = window.location.hash.replace("#", "");
    if (section && document.getElementById("sec-" + section) && typeof showSection === "function") {
        showSection(section);
    }
});
