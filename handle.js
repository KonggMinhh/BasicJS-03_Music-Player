const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
// variable
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
    // lay bai hat dau tien
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Chúng ta của hiện tại",
            singer: "Sơn Tùng M-TP",
            path: "Audio/Chung-Ta-Cua-Hien-Tai-Son-Tung-M-TP.mp3",
            image: "images/chungtacuahietai.jpg",
        },
        {
            name: "Đánh mất em",
            singer: "Quang Đăng Trần x Freak",
            path: "Audio/Đánh Mất Em.mp3",
            image: "images/danhmatem.jpg",
        },
        {
            name: "Sao cũng được",
            singer: "Thành Đạt",
            path: "Audio/SAO CŨNG ĐƯỢC.mp3",
            image: "images/saocungduoc.jpg",
        },
        {
            name: "Waiting for you",
            singer: "Mono",
            path: "Audio/Waiting For You Album 22.mp3",
            image: "images/waitingforyou.jpg",
        },
        {
            name: "Rồi ta sẽ ngắm pháo hoa cùng nhau",
            singer: "O.lew",
            path: "Audio/Rồi ta sẽ ngắm pháo hoa cùng nhau.mp3",
            image: "images/roitasengamphaohoa.jpg",
        },
        {
            name: "Em là kẻ đáng thương",
            singer: "Phát Huy T4",
            path: "Audio/EM LÀ KẺ ĐÁNG THƯƠNG .mp3",
            image: "images/emlakedangthuong.jpg",
        },
        {
            name: "Thuỷ chung",
            singer: "Thương Võ",
            path: "Audio/thuychung.mp3",
            image: "images/thuychung.jpg",
        },
        {
            name: "Kìa bóng dáng ai",
            singer: "Pháo Northside",
            path: "Audio/kiabongdangai.mp3",
            image: "images/kiabongdangai.jpg",
        },
        {
            name: "Stream đến bao giờ",
            singer: "ĐỘ MIXI ft. BẠN SÁNG TÁC",
            path: "Audio/streamdenbaogio.mp3",
            image: "images/streamdenbaogio.jpg",
        },
        {
            name: "Đúng đời",
            singer: "THIỆN HƯNG ft. ĐỘ MIXI",
            path: "Audio/dungdoi.mp3",
            image: "images/dungdoi.jpg",
        },
        {
            name: "Tình yêu bát cơm rang",
            singer: "Thiện Hưng ft Cường",
            path: "Audio/tinhyeucomrang.mp3",
            image: "images/tinhyeubatcomrang.jpg",
        },
    ],

    // render html
    render: function () {
        const htmls = this.songs.map((song) => {
            return `
            <div class="song">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        $(".playlist").innerHTML = htmls.join("");
    },
    // dinh nghia cac thuoc tinh
    defineProperty: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    // handle all
    // scroll top
    handleEvents: function () {
        // Xu ly khi CD / dung
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 10000, // 5 seconds
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();
        // Xu ly khi phong to thu nho
        const _this = this;
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
        // Xu khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        // Khi song duoc play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };
        // khi song bi pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };
        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };
        // xu ly khi tua + bug update
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };
        // Next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
        };
        // Back song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
        };
        // Xu ly khi random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
        };
        // XU ly khi lap lai 1 bai hat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };
        // Xu ly khi ket thu mot bai khac tu chuyen
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex < this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // dinh nghia cac thuoc tinh cho object
        this.defineProperty();
        // lang nghe / su ly cac su kien
        this.handleEvents();
        // Tai thong tin bai hat vao UI khi chay ung dung
        this.loadCurrentSong();
        // render playlist
        this.render();
    },
};
app.start();
