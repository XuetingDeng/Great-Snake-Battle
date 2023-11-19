// score.js

function updateScore(score) {
    const scoreColumn = document.querySelector('.score-column');
    scoreColumn.innerHTML = `<h2>Score</h2><p>${score}</p>`;
}
  
  export function displayGameResults(results) {
    const resultsList = document.createElement('ol');
  
    results.forEach((result, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = ` ${result.username}: ${result.score}`;
      resultsList.appendChild(listItem);
    });
  
    const resultsColumn = document.querySelector('.score-column');
    resultsColumn.innerHTML = '<h2>Game Results</h2>';
    resultsColumn.appendChild(resultsList);
  }
  
  // 调用示例
  // const exampleResults = [
  //   { username: 'Player1', score: 150 },
  //   { username: 'Player2', score: 120 },
  //   { username: 'Player3', score: 90 }
  // ];
  
  // displayGameResults(exampleResults);
  