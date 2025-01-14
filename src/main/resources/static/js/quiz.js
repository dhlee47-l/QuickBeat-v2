// 기존 모달 HTML 유지
const modalHTML = `
    <div class="modal-overlay" id="track-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-track">
                <div class="modal-artwork-container">
                    <div class="modal-artwork">
                        <div class="modal-artwork">
                            <div class="question-mark-overlay">
                                <i class="fa-solid fa-question"></i>
                            </div>
                            <img id="modal-img" src="" alt="">
                        </div>
                    </div>
                    <div class="modal-track-info">
                        <div class="modal-track-name" id="modal-name"></div>
                        <div class="modal-track-artist" id="modal-artist"></div>
                    </div>
                </div>
                <div class="modal-quiz-buttons">
                    <button class="modal-quiz-button modal-o-button" id="modal-o-button">O</button>
                    <button class="modal-play-button" id="modal-play-button">
                        <i class="fa-solid fa-play"></i>
                    </button>
                    <button class="modal-quiz-button modal-x-button" id="modal-x-button">X</button>
                </div>
            </div>
        </div>
    </div>
`;

const scoreModalHTML = `
    <div class="score-button-container">
        <button class="check-score-button">점수를 확인하세요!</button>
    </div>
    <div class="score-modal-overlay" id="score-modal">
        <div class="score-modal-content">
            <div class="score-text">당신의 점수는</div>
            <div class="score-value" id="final-score"></div>
            <button class="score-close-button" onclick="closeScoreModal()">닫기</button>
        </div>
    </div>
`;

let trackData = null;
let currentTrackIndex = null;
const $trackListDiv = $('#track-list');
let answeredQuestions = new Set();
let totalQuestions = 0;
let isPlaying = false;

// Initialize
$('body').append(modalHTML);
$('body').append(scoreModalHTML);

// Load tracks from Spring Boot API
async function loadTracks() {
    try {
        // const urlParams = new URLSearchParams(window.location.search);
        // const answerId = urlParams.get('id');
        const answerId = window.location.pathname.split('/').pop();

        if (!answerId) {
            console.error('No answer ID provided');
            return;
        }

        const response = await fetch(`/api/tracks/${answerId}`);
        if (!response.ok) throw new Error('Failed to fetch tracks');

        trackData = await response.json();
        totalQuestions = trackData.length;

        if (trackData && trackData.length > 0) {
            $trackListDiv.html(trackData.map((track, index) => createTrackElement(track, index)).join(''));
        } else {
            $trackListDiv.html('<p style="grid-column: 1/-1; text-align: center; padding: 32px; color: #666;">Coming Soon!</p>');
        }
    } catch (error) {
        console.error('Error loading tracks:', error);
    }
}

function createTrackElement(track, index) {
    return `
        <div class="track-item" onclick="openModal(${index})">
            <div class="track-cover" id="track-cover-${index}">
                <div class="quiz-number">Question ${index + 1}</div>
            </div>
            <div class="artwork-container">
                <img src="${track.albumImage}" alt="${track.name}">
            </div>
            <div class="track-info">
                <div class="track-name">${track.name}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
        </div>
    `;
}

// Spotify Playback Control Functions
async function playTrack(uri) {
    try {
        await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: [uri]
            })
        });
    } catch (error) {
        console.error('Error playing track:', error);
    }
}

async function pausePlayback() {
    try {
        await fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
    } catch (error) {
        console.error('Error pausing playback:', error);
    }
}

function togglePlay() {
    const track = trackData[currentTrackIndex];
    const $playButton = $('#modal-play-button');

    if (!isPlaying) {
        playTrack(track.uri);
        $playButton.html('<i class="fa-solid fa-pause"></i>');
    } else {
        pausePlayback();
        $playButton.html('<i class="fa-solid fa-play"></i>');
    }

    isPlaying = !isPlaying;
}

function openModal(index) {
    const track = trackData[index];
    currentTrackIndex = index;

    $('#modal-img').attr('src', track.albumImage);
    $('#modal-name').text(track.name);
    $('#modal-artist').text(track.artist);

    $('#track-modal').addClass('active');
    $('.question-mark-overlay').removeClass('hidden');
    $('.modal-track-info').removeClass('visible');

    $('#modal-play-button')
        .html('<i class="fa-solid fa-play"></i>')
        .off('click')
        .on('click', togglePlay);

    $('#modal-o-button').off('click').on('click', () => handleO(index));
    $('#modal-x-button').off('click').on('click', () => handleX(index));
}

function closeModal() {
    $('#track-modal').removeClass('active');
    if (isPlaying) {
        pausePlayback();
        isPlaying = false;
    }
}

function handleO(index) {
    const $trackCover = $(`#track-cover-${index}`);
    if ($trackCover.is(':visible')) {
        answeredQuestions.add(index);
    }
    $trackCover.hide();

    $('.question-mark-overlay').addClass('hidden');
    $('.modal-track-info').addClass('visible');
    closeModal();
}

function handleX(index) {
    const $trackItem = $('.track-item').eq(index);
    const $trackCover = $(`#track-cover-${index}`);

    const $existingXMark = $trackItem.find('.x-mark');
    if ($existingXMark.length) {
        $existingXMark.remove();
    }

    const $xMark = $('<div>', { class: 'x-mark', text: '×' });
    $trackCover.append($xMark);
    closeModal();
}

function startConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function calculateScore() {
    return totalQuestions === 0 ? 0 : Math.round((answeredQuestions.size / totalQuestions) * 100);
}

function showScore() {
    const score = calculateScore();
    $('#final-score').text(`${score}점`);
    $('#score-modal').addClass('active');

    if (score === 100) {
        startConfetti();
    }
}

function closeScoreModal() {
    $('#score-modal').removeClass('active');
}

// Event Listeners
$('.check-score-button').on('click', showScore);

$('#score-modal').on('click', function(e) {
    if ($(e.target).hasClass('score-modal-overlay')) {
        closeScoreModal();
    }
});

$('#track-modal').on('click', function(e) {
    if ($(e.target).hasClass('modal-overlay')) {
        closeModal();
    }
});

// Initialize on page load
$(document).ready(() => {
    loadTracks();
});