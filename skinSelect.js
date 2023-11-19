
// 存储变量到 localStorage
localStorage.setItem('player1SelectedSkin', "./public/appearance/moon.png");
localStorage.setItem('player2SelectedSkin', "./public/appearance/star.png");

// Function to handle player 1 skin selection
function selectPlayer1Skin(skin) {
    localStorage.setItem('player1SelectedSkin', skin);
    // console.log("selectPlayer1Skin" + localStorage.getItem('player1SelectedSkin'))
}

// Function to handle player 2 skin selection
function selectPlayer2Skin(skin) {
    localStorage.setItem('player2SelectedSkin', skin);
    // console.log("player2SelectedSkin" + skin)
}

function player1Ready() {
    if (localStorage.getItem('player1SelectedSkin')) {
        // Player 1 is ready with the selected skin
        // You can trigger the game to start or perform other actions
        console.log("Player 1 is ready with skin: " + localStorage.getItem('player1SelectedSkin'));
        return true;
    } else {
        alert("Player 1 must select a skin before being ready.");
    }
}

function player2Ready() {
    if (localStorage.getItem('player2SelectedSkin')) {
        // Player 2 is ready with the selected skin
        // You can trigger the game to start or perform other actions
        console.log("Player 2 is ready with skin: " + localStorage.getItem('player2SelectedSkin'));
        return true;
    } else {
        alert("Player 2 must select a skin before being ready.");
    }
}

function allReady() {
    if (player1Ready() && player2Ready()) {
        window.location.href = "index.html";
    }
}

// module.exports = player1SelectedSkin;
// module.exports = player2SelectedSkin; 
