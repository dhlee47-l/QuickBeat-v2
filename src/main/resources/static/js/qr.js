document.addEventListener('DOMContentLoaded', async function() {
    // URL 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const qrId = urlParams.get('id');
    const answerId = urlParams.get('answer');

    // QR 생성 페이지 로직 (/qr?id=...)
    if (qrId) {
        try {
            // QR 코드에 들어갈 URL 생성
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
            const qrUrl = `${baseUrl}/qr?answer=${qrId}`;

            // QR 코드 생성
            new QRCode(document.getElementById("qrcode"), {
                text: qrUrl,
                width: 256,
                height: 256
            });

            // answer-sheet는 숨기고 qr-container만 보이게
            document.querySelector('.qr-container').style.display = 'block';
            const answerSheet = document.getElementById('answer-sheet');
            if (answerSheet) {
                answerSheet.style.display = 'none';
            }

        } catch (error) {
            console.error('Error generating QR code:', error);
            showError('QR 코드 생성 중 오류가 발생했습니다.');
        }
    }

    // 답지 보기 페이지 로직 (/qr?answer=...)
    if (answerId) {
        try {
            await showAnswerSheet(answerId);
        } catch (error) {
            console.error('Error showing answer sheet:', error);
            showError('답안 조회 중 오류가 발생했습니다.');
        }
    }
});

async function showAnswerSheet(answerId) {
    try {
        // Spring Boot API에서 트랙 데이터 가져오기
        const response = await fetch(`/api/tracks/${answerId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch tracks data');
        }
        const tracks = await response.json();
        console.log(tracks)

        // qr-container 숨기기
        const qrContainer = document.querySelector('.qr-container');
        if (qrContainer) {
            qrContainer.style.display = 'none';
        }

        // answer-sheet 보여주기
        const answerSheet = document.getElementById('answer-sheet');
        if (answerSheet) {
            answerSheet.style.display = 'block';
        }

        // 트랙 리스트 렌더링
        const trackList = document.getElementById('track-list');
        if (trackList) {
            trackList.innerHTML = tracks.map(track => `
                <div class="track-item">
                    <div class="artwork-container">
                        <img src=${track.albumImage} alt="${track.name}">
                    </div>
                    <div class="track-info">
                        <div class="track-name">${track.name}</div>
                        <div class="track-artist">${track.artist}</div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error fetching track data:', error);
        showError('트랙 데이터를 불러오는 중 오류가 발생했습니다.');
    }
}

function showError(message) {
    // 에러 메시지를 보여주는 UI 요소가 있다고 가정
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function goToQuiz() {
    window.location.href = '/quiz';
}

// URL 파라미터에서 특정 값을 가져오는 헬퍼 함수
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}