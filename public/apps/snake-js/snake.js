const helpers = helpersModule();
const snakeGridSize = 40;
const snakeSpeed = 100;
const snakeLength = 6;
const keyBinding = {"ArrowUp": "u", "ArrowDown" : 'd', "ArrowLeft" : 'l', "ArrowRight" : 'r'}

let score = scoreFactory(0);
let playArea = playAreaFactory(snakeGridSize);
let snake = snakeFactory([20,20]);
let food = foodFactory();
playArea.render();

let setInv = setInterval(tick, snakeSpeed);

document.addEventListener("keydown", (event) =>{
  const key = event.key;
  if(key in keyBinding){
    snake.changeDirection(keyBinding[key]);
  }
})

const restartButton = document.querySelector("#restartButton");
restartButton.addEventListener("click", (e) => restart());

/***************************************************************************************/

function tick() {
  snake.move();
  playArea.render();
}

function stopGame(){
  clearInterval(setInv);
}

function fail(){
  stopGame();
  console.log("YOU DIED");
}

function restart(){
  stopGame();
  playArea = playAreaFactory(snakeGridSize);
  snake = snakeFactory([20,20]);
  food = foodFactory();
  playArea.render();
  score.resetScore();

  setInv = setInterval(tick, snakeSpeed);
}

function snakeFactory(startPosition){             // [0,0] is top left, [39, 39] is bottom right, [0, 39] is bottom left, [39,0] is top right.  [x,y] starting at top left
  const body = [startPosition]; // [[20, 20]]
  const moveList = {'r' : [1, 0], 'l' : [-1,0], 'u' : [0,-1], 'd' : [0,1]};
  const oppositeMoves = {'u' : 'd', 'd' : 'u', 'l' : 'r', 'r' : 'l'};

  let length = snakeLength;
  let snakeDirection = 'l';

  return {
    move,
    getBody,
    foundFood,
    changeDirection,
    headLocaton: getHeadLocation,
    }


  function move(){
    const [x, y] = moveList[snakeDirection];
    const head = body[body.length - 1].slice();
    let tail;

    head[0] += x;
    head[1] += y;
    body.push(head);

    if(body.length > length) {
      tail = body.shift()
      playArea.unSelectSpace(tail);
    }
    playArea.checkCollision(body);
  }

  function changeDirection(direction){
    if(direction !== oppositeMoves[snakeDirection]) snakeDirection = direction;
  }

  function foundFood(){
    food.getsEaten();
    eat();
    score.updateScore(10 + length);
  }

  function eat(){
    length++;
  }

  function getHeadLocation(){
    return body[0];
  }

  function getBody(){
    return body;
  }
}

function playAreaFactory(size){
  const board = boardFactory(size);

  createBoard();

  return {
    selectSnakeSpaces,
    selectFoodSpaces,
    unSelectSpace,
    checkCollision,
    render
    }

  function checkCollision(body){
    const head = body[body.length - 1];
    if(helpers.isEquivalent(head, food.getFoodLocation())){ snake.foundFood() };
    if(helpers.isArrayIn2dArray(head, body.slice(1, body.length - 1))){fail()};
    if(isOutsideGrid(head)){
      return fail();
    };
    selectSnakeSpaces(body);
  }

  function isOutsideGrid(head){
    return head.some((number) => {
      return number >= snakeGridSize || number < 0
    });
  }

  function render(){
    for(column in board){
      board[column].forEach((space, index) => {
        let currentSpaceDOMElement = document.querySelector(`.${column} .row${index}`)
        if(space === "snake"){
          currentSpaceDOMElement.classList.remove("occupiedFood");
          currentSpaceDOMElement.classList.add("occupiedSnake");
        } else if (space === "food") {
          currentSpaceDOMElement.classList.add("occupiedFood");
        } else {
          currentSpaceDOMElement.classList.remove("occupiedSnake", "occupiedFood");
        }
      })
    }
  }

  function createBoard(){
    let container = document.querySelector(".playAreaContainer");
    container.innerHTML = "";
    for(let i = 0; i < snakeGridSize; i++){
      container.appendChild(generateColumn(i));
    }
  }

  function selectSnakeSpaces(body){
    body.forEach(([column, row]) => {
      board[`column${column}`][row] = "snake";
    })
  }

  function selectFoodSpaces([x, y]){
    board[`column${x}`][y] = "food"
  }

  function unSelectSpace([column, row]){
    board[`column${column}`][row] = null;
  }
}

function boardFactory(size){
  var board = {}
  for(let i = 0; i < size; i++){
    board[`column${i}`] = []
    for(let j = 0; j < size; j++){
      board[`column${i}`][j] = false;
    }
  }
  return board;
}

function generateColumn(columnIndex) {
  const column = document.createElement('div');
  column.classList.add(`column${columnIndex}`, "column");

  for(let i = 0; i < snakeGridSize; i++){
    let row = document.createElement('div');
    row.classList.add(`row${i}`, "row");
    column.appendChild(row);
  }
  return column;
};

function foodFactory(){
  let foodLocation = getRandomOrderedPair();

  createNewFood();

  return {
    getFoodLocation,
    getsEaten: createNewFood
  }

  function getRandomOrderedPair(){
    min = Math.ceil(0);
    max = Math.floor(39);
    return [(Math.floor(Math.random() * (max - min)) + min), (Math.floor(Math.random() * (max - min)))];
  }

  function createNewFood(){
    const oldFoodLocation = foodLocation;
    foodLocation = getRandomOrderedPair();
    if(!helpers.isArrayIn2dArray(foodLocation, snake.getBody())){
      updatePlayArea(oldFoodLocation);
    } else {
      createNewFood();
    }
  }

  function getFoodLocation(){
    return foodLocation;
  }

  function updatePlayArea(oldFoodLocation){
    playArea.selectFoodSpaces(foodLocation);
    playArea.unSelectSpace(oldFoodLocation);
  }
}

function scoreFactory(initialScore){
  let score = initialScore;
  const scoreDisplay = document.getElementById("score");

  return {
    updateScore,
    resetScore
  }

  function updateScore(amount){
    increaseScore(amount);
    displayScore();
  }

  function increaseScore(amount){
    score = score + amount;
  }

  function displayScore(){
    scoreDisplay.textContent = "Score: " + score * 10;
  }

  function resetScore(){
    score = 0;
    displayScore();
  }
}

function helpersModule(){
  return {
    isEquivalent,
    isArrayIn2dArray
  }

  function isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
  }

  function isArrayIn2dArray(key, array2d){
    return array2d.some((array) => {return (array[0] == key[0] && array[1] == key[1])});
  }
}




// TODO
// Add lose screen
// add  style
// add win condition
