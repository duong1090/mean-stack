// config/auth.js
module.exports = {
    'facebookAuth': {
        'clientID': '41521856961-vlca6r9otepenq6vq4c3p30ji8bol603.apps.googleusercontent.com', // App ID của bản
        'clientSecret': '07HB37fkQG-A7xxqNT4tazQa', // App Secret của bạn
        'callbackURL': 'http://localhost:8080/auth/facebook/callback'
    },
    'googleAuth': {
        'clientID': '41521856961-la3v31q5ijlti3hglee72hlqhh7anfjn.apps.googleusercontent.com',
        'clientSecret': 'LzzIVk2N81GM6ItWW8Fdq7WR',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    }
};