let player1SelectedSkin = null;
let player2SelectedSkin = null;

    // Function to handle player 1 skin selection
function selectPlayer1Skin(skin) {
    player1SelectedSkin = skin;

        // Add styling to indicate the selected skin (e.g., border highlight)
        // You can also update the player's avatar with the selected skin
}

    // Function to handle player 2 skin selection
function selectPlayer2Skin(skin) {
    player2SelectedSkin = skin;

        // Add styling to indicate the selected skin (e.g., border highlight)
        // You can also update the player's avatar with the selected skin
}

function player1Ready() {
    if (player1SelectedSkin) {
        // Player 1 is ready with the selected skin
        // You can trigger the game to start or perform other actions
        console.log("Player 1 is ready with skin: " + player1SelectedSkin);
        return true;
    } else {
        alert("Player 1 must select a skin before being ready.");
    }
}

function player2Ready() {
    if (player2SelectedSkin) {
        // Player 2 is ready with the selected skin
        // You can trigger the game to start or perform other actions
        console.log("Player 2 is ready with skin: " + player2SelectedSkin);
        return true;
    } else {
        alert("Player 2 must select a skin before being ready.");
    }
}

function allReady() {
    if(player1Ready() && player2Ready()){
        window.location.href = "index.html";
    }
}

module.exports = player1SelectedSkin;
module.exports = player2SelectedSkin; 
