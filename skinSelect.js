
// 存储变量到 localStorage
localStorage.setItem('player1SelectedSkin', "./public/appearance/moon.png");
localStorage.setItem('player2SelectedSkin', "./public/appearance/star.png");
localStorage.setItem('player1Name', "Player1");
localStorage.setItem('player2Name', "Player2");

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
    let username = document.getElementById('username1').value;
    if(username){
        localStorage.setItem('player1Name', username);
    }
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
    let username = document.getElementById('username2').value;
    if(username){
        localStorage.setItem('player2Name', username);
    }
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

// document.addEventListener("DOMContentLoaded", function() {
//     const skinImages = document.querySelectorAll('.skinImage');

//     skinImages.forEach(img => {
//         img.addEventListener('click', function() {
//             // 移除所有其他图片的特殊类
//             skinImages.forEach(img => {
//                 img.classList.remove('selectedSkin');
//                 img.classList.remove('selectedHover');
//             });

//             // 为被点击的图片添加类
//             this.classList.add('selectedSkin');
//             this.classList.add('selectedHover');
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", function() {
    const skinImagesPlayer1 = document.querySelectorAll('.skinOption:nth-child(1) .skinImage');
    const skinImagesPlayer2 = document.querySelectorAll('.skinOption:nth-child(2) .skinImage');
    let selectedSkinPlayer1 = null;
    let selectedSkinPlayer2 = null;

    function updateSkinSelection(images, selectedSkin, otherPlayerSkin) {
        images.forEach(img => {
            img.addEventListener('click', function() {
                if (selectedSkin) {
                    selectedSkin.classList.remove('selectedSkin');
                    selectedSkin.classList.remove('selectedHover');
                }
                this.classList.add('selectedSkin');
                this.classList.add('selectedHover');
                selectedSkin = this;

                if (otherPlayerSkin) {
                    otherPlayerSkin.classList.add('selectedHover');
                }
            });
        });
    }

    updateSkinSelection(skinImagesPlayer1, selectedSkinPlayer1, selectedSkinPlayer2);
    updateSkinSelection(skinImagesPlayer2, selectedSkinPlayer2, selectedSkinPlayer1);
});

document.addEventListener("DOMContentLoaded", function() {
    const readyButtons = document.querySelectorAll('.readyButton');

    readyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 为被点击的按钮添加类
            this.classList.add('readyButtonClicked');
        });
    });
});