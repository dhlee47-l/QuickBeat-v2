const MainController = (function() {
    const CONFIG = {
        clientId: '724a3cf2d2e44418acea58d9eea869af',
        redirectUri: 'http://localhost:8080/shuffle',
        authUrl: 'https://accounts.spotify.com/authorize',
        tokenUrl: 'https://accounts.spotify.com/api/token',
        scope: 'user-read-private user-read-email playlist-read-private user-read-playback-state user-modify-playback-state'
    };

    const generateCodeVerifier = (length = 128) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], '');
    };

    const sha256 = async (plain) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    };

    const base64URLEncode = (array) => {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(array)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    const generateCodeChallenge = async (verifier) => {
        const hashed = await sha256(verifier);
        return base64URLEncode(hashed);
    };

    const handlePlayGame = async (event) => {
        event.preventDefault();

        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        localStorage.setItem('code_verifier', codeVerifier);

        const args = new URLSearchParams({
            client_id: CONFIG.clientId,
            response_type: 'code',
            redirect_uri: CONFIG.redirectUri,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            scope: CONFIG.scope
        });

        const authUrl = new URL(CONFIG.authUrl);
        authUrl.search = args.toString();
        window.location.href = authUrl.toString();
    };

    const getToken = async code => {
        const codeVerifier = localStorage.getItem('code_verifier');

        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CONFIG.clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: CONFIG.redirectUri,
                code_verifier: codeVerifier,
            }),
        };

        const response = await fetch(CONFIG.tokenUrl, payload);
        const data = await response.json();

        localStorage.setItem('access_token', data.access_token);

        if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
        }

        return data;
    };

    const getRefreshToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');

        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: CONFIG.clientId
            }),
        };

        const response = await fetch(CONFIG.tokenUrl, payload);
        const data = await response.json();

        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
        }

        return data;
    };

    const init = () => {
        const playButton = document.querySelector('.btn-main');
        playButton.addEventListener('click', handlePlayGame);
    };

    return {
        init,
        getToken,
        getRefreshToken
    };
})();

document.addEventListener('DOMContentLoaded', MainController.init);