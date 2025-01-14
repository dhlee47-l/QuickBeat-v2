let trackData = null;
let currentTrackIndex = null;
const $trackListDiv = $('#track-list');
let answeredQuestions = new Set();
let totalQuestions = 0;
let isPlaying = false;

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


$('body').append(modalHTML);
$('body').append(scoreModalHTML);

// Load tracks from Spring Boot API
async function loadTracks() {
    try {
        const answerId = window.location.pathname.split('/').pop();

        console.log(answerId)
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

// Device activation function
async function activateDevice(deviceId, token) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                device_ids: [deviceId],
                play: false
            })
        });

        if (!response.ok && response.status !== 204) {
            throw new Error('Failed to activate device');
        }

        return true;
    } catch (error) {
        console.error('Error activating device:', error);
        return false;
    }
}

async function playTrack(uri) {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = '/';
            return;
        }

        const deviceResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (deviceResponse.status === 401) {
            alert('401 error');
            return;
        }

        const devices = await deviceResponse.json();
        console.log(devices);

        if (!devices.devices.length) {
            alert('Please open Spotify on any device first!');
            return;
        }

        const device = devices.devices[0];
        if (!device.is_active) {
            const activated = await activateDevice(device.id, token);
            if (!activated) {
                throw new Error('Failed to activate device');
            }
            // Wait a short moment for the device to be ready
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Try to play
        const response = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: [uri]
            })
        });

        if (response.status === 404) {
            alert('Please start playing any track on Spotify first, then try again.');
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to play track');
        }

        isPlaying = true;
        updatePlayButtonState(true);
    } catch (error) {
        console.error('Error playing track:', error);
        isPlaying = false;
        updatePlayButtonState(false);

        if (error.message === 'Failed to play track') {
            alert('Unable to play track. Please make sure Spotify is active and try again.');
        }
    }
}

async function pausePlayback() {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = '/';
            return;
        }

        const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status !== 404 && !response.ok) {
            throw new Error('Failed to pause');
        }

        isPlaying = false;
        updatePlayButtonState(false);
    } catch (error) {
        console.error('Error pausing playback:', error);
    }
}

function updatePlayButtonState(playing) {
    const $playButton = $('#modal-play-button');
    $playButton.html(`<i class="fa-solid fa-${playing ? 'pause' : 'play'}"></i>`);
}

async function togglePlay() {
    const track = trackData[currentTrackIndex];

    if (!isPlaying) {
        await playTrack(track.uri);
    } else {
        await pausePlayback();
    }
}

function openModal(index) {
    const track = trackData[index];
    currentTrackIndex = index;

    $('#modal-img').attr('src', track.albumImage);
    $('#modal-name').text(track.name);
    $('#modal-artist').text(track.artist);

    $('#track-modal').addClass('active');

    if (answeredQuestions.has(index)) {
        $('.question-mark-overlay').addClass('hidden');
        $('.modal-track-info').addClass('visible');
    } else {
        $('.question-mark-overlay').removeClass('hidden');
        $('.modal-track-info').removeClass('visible');
    }


    updatePlayButtonState(false);
    isPlaying = false;

    $('#modal-play-button').off('click').on('click', togglePlay);
    $('#modal-o-button').off('click').on('click', () => handleO(index));
    $('#modal-x-button').off('click').on('click', () => handleX(index));
}

function closeModal() {
    $('#track-modal').removeClass('active');
    if (isPlaying) {
        pausePlayback();
    }
}

function handleO(index) {
    // Add to answered questions set only for O responses
    answeredQuestions.add(index);

    // Hide question mark overlay and show track info
    $('.question-mark-overlay').addClass('hidden');
    $('.modal-track-info').addClass('visible');

    // Hide the cover on the track list
    const $trackCover = $(`#track-cover-${index}`);
    $trackCover.hide();
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


$(document).ready(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            window.location.href = '/';
            return;
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        window.location.href = '/';
        return;
    }

    loadTracks();
});