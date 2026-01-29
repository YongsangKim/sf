// 모든 1뎁스 메뉴 항목 선택
const menuItems = document.querySelectorAll('.gnb > li');

// 각 메뉴 항목에 마우스 오버 이벤트 리스너 추가
menuItems.forEach(item => {
    item.addEventListener('mouseover', () => {
        const subMenu = item.querySelector('.sub-menu');
        if (subMenu) {
            subMenu.classList.add('show'); // show 클래스 추가
        }
    });

    item.addEventListener('mouseout', () => {
        const subMenu = item.querySelector('.sub-menu');
        if (subMenu) {
            subMenu.classList.remove('show'); // show 클래스 제거
        }
    });
});


// 모든 모달 열기 버튼에 이벤트 등록
document.querySelectorAll(".openModalBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const modal = document.getElementById(targetId);
        modal.style.display = "block";
    });
});

// 모든 닫기 버튼에 이벤트 등록
document.querySelectorAll(".modal .close").forEach(closeBtn => {
    closeBtn.addEventListener("click", () => {
        closeBtn.closest(".modal").style.display = "none";
    });
});

// 배경 클릭 시 닫기
window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
});
  

// 탭
const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => {
            t.setAttribute('aria-selected', false);
            t.classList.remove('active');
        });
        panels.forEach(p => p.hidden = true);

        tab.setAttribute('aria-selected', true);
        tab.classList.add('active');
        panels[index].hidden = false;
    });
});


// YouTube URL에서 비디오 ID 추출
function extractVideoId(input) {
    if (!input) return null;
    input = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    let match = input.match(/[?&]v=([^&]+)/);
    if (match) return match[1];
    match = input.match(/youtu\.be\/([^?]+)/);
    if (match) return match[1];
    match = input.match(/embed\/([^?]+)/);
    if (match) return match[1];
    return null;
}

// YouTube IFrame API 로드
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 플레이어 저장 배열
var players = [];

// API 준비 완료 시 실행되는 콜백
function onYouTubeIframeAPIReady() {
    const videoElements = document.querySelectorAll('.main-video[data-url]');
    
    videoElements.forEach((element, index) => {
        const videoUrl = element.getAttribute('data-url');
        const videoId = extractVideoId(videoUrl);
        
        if (!videoId) {
            console.error('Invalid video URL:', videoUrl);
            return;
        }
        
        // data-width와 data-height 속성 읽기
        const width = element.getAttribute('data-width') || '640';
        const height = element.getAttribute('data-height') || '360';
        
        // 플레이어를 담을 div 생성
        const playerDiv = document.createElement('div');
        playerDiv.id = `youtube-player-${index}`;
        element.appendChild(playerDiv);
        
        // YouTube 플레이어 생성 (width와 height를 iframe에 적용)
        const player = new YT.Player(playerDiv.id, {
            videoId: videoId,
            width: width,
            height: height,
            playerVars: {
                autoplay: 1,
                mute: 1,
                controls: 0,
                showinfo: 0,
                rel: 0,
                loop: 1,
                playlist: videoId,
                modestbranding: 1,
                playsinline: 1,
                disablekb: 1,
                fs: 0,
                iv_load_policy: 3
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
        
        players.push(player);
    });
}

function onPlayerReady(event) {
    event.target.mute();
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        event.target.playVideo();
    }
}

function onPlayerError(event) {
    console.error('YouTube Player Error:', event.data);
}

function pauseAllPlayers() {
    players.forEach(player => {
        if (player && player.pauseVideo) {
            player.pauseVideo();
        }
    });
}

function playAllPlayers() {
    players.forEach(player => {
        if (player && player.playVideo) {
            player.playVideo();
        }
    });
}

function getPlayer(index) {
    return players[index];
}