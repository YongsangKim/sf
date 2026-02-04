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


// 이벤트 위임으로 모달 열기 처리
document.body.addEventListener("click", (e) => {
    const openBtn = e.target.closest(".openModalBtn");
    if (openBtn) {
        e.preventDefault(); // 👉 a 링크 기본 이동 막기
        const targetId = openBtn.getAttribute("data-target");
        const modal = document.getElementById(targetId);
        if (modal) {
            modal.style.display = "block";
            modal.classList.add("active");
        }
    }

    // 닫기 버튼 처리
    if (e.target.classList.contains("close")) {
        const modal = e.target.closest(".modal");
        if (modal) {
            modal.style.display = "none";
            modal.classList.remove("active");
        }
    }
});

// 배경 클릭 시 닫기
window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
        event.target.classList.remove("active"); // 👉 active 클래스 제거
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
        if (panels[index]) {
            panels[index].hidden = false; 
        }

        // URL 이동 추가
        const url = tab.dataset.url;
        if (url) {
            window.location.href = url; // 같은 창에서 이동
            // window.open(url, "_blank"); // 새 창에서 열고 싶을 경우
        }
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

// 무기
function showJson(menu, btn, parentMenu = null) {
    // 모든 버튼 비활성화
    document.querySelectorAll(".info-weapon button").forEach(b => b.setAttribute("aria-selected", "false"));

    // 현재 버튼 활성화
    btn.setAttribute("aria-selected", "true");

    // 하위 메뉴 클릭 시 상위 메뉴도 활성화
    if (parentMenu) {
        const parentBtn = [...document.querySelectorAll("button")]
            .find(b => b.textContent.trim() === parentMenu);
        if (parentBtn) parentBtn.setAttribute("aria-selected", "true");

        // 같은 그룹의 다른 하위 메뉴는 비활성화
        const siblings = parentBtn.nextElementSibling?.querySelectorAll("button");
        if (siblings) siblings.forEach(sib => {
            if (sib !== btn) sib.setAttribute("aria-selected", "false");
        });
    }

    // 상위 메뉴 클릭 시 첫 번째 하위 메뉴만 활성화
    if (!parentMenu && typeof weaponData[menu] === "object" && !Array.isArray(weaponData[menu])) {
        const firstChild = Object.keys(weaponData[menu])[0];
        const childBtn = [...document.querySelectorAll("button")]
            .find(b => b.textContent.trim() === firstChild);
        if (childBtn) childBtn.setAttribute("aria-selected", "true");
        menu = firstChild; // 첫 번째 하위 메뉴 데이터로 렌더링
        parentMenu = Object.keys(weaponData).find(key => weaponData[key][firstChild]);
    }

    // 무기 리스트 렌더링
    const list = document.getElementById("weaponList");
    list.innerHTML = "";

    let items = parentMenu ? weaponData[parentMenu][menu] : weaponData[menu];
    if (Array.isArray(items)) {
        items.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
            <a href="#" class="openModalBtn" data-target="${item.모달}">
                <img src="${item.이미지}" alt="">
                <span class="info-weapon-tit">${item.이름}</span>
            </a>
            `;
            list.appendChild(li);
        });
    }
  }
  
  // 페이지 로드 시 기본 활성화: 첫 번째 상위 메뉴 + 첫 번째 하위 메뉴
  window.addEventListener("DOMContentLoaded", () => {
        const firstParentBtn = document.querySelector(".info-weapon-depth1 > li > button");
        if (firstParentBtn) {
            showJson(firstParentBtn.textContent.trim(), firstParentBtn);
        }
  });