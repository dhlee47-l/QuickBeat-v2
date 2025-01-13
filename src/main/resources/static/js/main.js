const MainController = (function() {
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

        const clientId = '724a3cf2d2e44418acea58d9eea869af';
        const redirectUri = 'http://localhost:8080/shuffle'; // Changed to redirect to shuffle page

        // Generate PKCE values
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        // Store verifier for later use
        localStorage.setItem('code_verifier', codeVerifier);

        // Create authorization URL
        const args = new URLSearchParams({
            client_id: clientId,
            response_type: 'code',
            redirect_uri: redirectUri,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            scope: 'user-read-private user-read-email playlist-read-private user-modify-playback-state'
        });

        // Redirect to Spotify authorization
        window.location = 'https://accounts.spotify.com/authorize?' + args;
    };

    // Initialize event listeners
    const init = () => {
        const playButton = document.querySelector('.btn-main');
        playButton.addEventListener('click', handlePlayGame);
    };

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', MainController.init);