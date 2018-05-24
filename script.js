// css: no inner borders / radius to 100% on all -> even design, but no borders...

// potential additions - speed up computer's pattern after 
//a certain count is reached

// start button disabled while pattern running, b/c couldn't figure
//out how to stop the setTimeout process mid-run

// lesson learned - use a callback to handle scheduling and delaying events for when the computer is displaying the pattern


let computerArray = [];
let spotInCount = 0;
let strictMode = false;
let gameStarted = false;
let off = true;

var greenAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
var redAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
var yellowAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
var blueAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");

var onOffSwitch = (target) => {
  if (target === 'off') {
    if (x === -1) {
      $("#right").css("background-color", "black");
      $("#left").css("background-color", "blue");
      reset();
      $("#countScreen").html("  ");
      if (strictMode) {
        strictMode = false;
        $("#strictLight").css("background-color", "black");
      }
      x = 0;
      off = true;
    }
  } else if (target === 'on') {
    $("#left").css("background-color", "black");
    $("#right").css("background-color", "blue");
    $("#countScreen").html("--");
    x = -1;
    off = false;
  }
}

var startButton = () => {
  if (x === -1 && !off) {
    gameStarted = true;
    startGame();
  }
}

var strictButton = () => {
  if (!off) {
    if (strictMode) {
      strictMode = false;
      $("#strictLight").css("background-color", "black");
    } else {
      strictMode = true;
      $("#strictLight").css("background-color", "gold");
    }
  }
}

var panelClick = (panelId) => {
  
  if (x === -1 && gameStarted) {
    let thisId = "#" + panelId;
    let initColor;
    let colorChange;
    makeSound(panelId);
    switch (panelId) {
      case "green":
        initColor = "#00A756";
        colorChange = "#00FC82";
        break;
      case "red":
        initColor = "#A30A1C";
        colorChange = "#F23148";
        break;
      case "yellow":
        initColor = "#CDA636";
        colorChange = "#DEC47A";
        break;
      case "blue":
        initColor = "#054B8A";
        colorChange = "#0980EC";
        break;
    }

    $(thisId).css("background-color", colorChange);
    setTimeout(function(){
      $(thisId).css("background-color", initColor);
    }, 250);

    if (panelId === computerArray[spotInCount]) {
      //alert("correct!");
      spotInCount++;
      if (spotInCount > 19) {
        //alert("You Win!");
        x = 0;
        $("#countScreen").html("Win");
        spotInCount = 0;
        gameStarted = false;
        setTimeout(function() {
          reset();
          startGame();
          
        }, 4000);
        
      } else if (spotInCount > (computerArray.length - 1)) {
        computerMove();
        spotInCount = 0;
      }
    } else {
      // alert("wrong!");
      // change x value to disable buttons
      // do setTimeout to delay
      // jquery change count back to computerArray length
      x = 0;
      $("#countScreen").html("!!");
      spotInCount = 0;
      setTimeout(function() {
        $("#countScreen").html(computerArray.length);
        if (strictMode) {
          reset();
          computerMove();
        } else {
          loopArray(computerArray);
        }
      }, 2000);
      
    }
  }
};

var computerMove = () => {
  x = 0;
  pointerStyle("off");
  // random number function to choose panelId
  // push random panel into computerArray
  let randomNum = Math.floor(Math.random() * 4);
  switch (randomNum) {
    case 0:
      computerArray.push("green");
      break;
    case 1:
      computerArray.push("red");
      break;
    case 2:
      computerArray.push("yellow");
      break;
    case 3:
      computerArray.push("blue");
      break;
  }
  if (computerArray.length < 10) {
    $("#countScreen").html("0" + computerArray.length);
  } else {
    $("#countScreen").html(computerArray.length);
  }
  
  // displays computer pattern
  loopArray(computerArray);
};

// x starts game at -1 b/c at -1 it is player's turn (after computer runs first turn)
// game starts then x set to 0 below to properly
//loop through computerArray starting at 0
// after computer turn x set back to -1
// which is criteria for button click to work for player
var x = -1;
var loopArray = function(arr) {
  if (x === -1) {
    x = 0;
  }
  showPattern(arr[x],function(){
    x++;
    if(x < arr.length) {
      loopArray(arr);   
    } else {
      x = -1;
      pointerStyle("on");
    }
  }); 
};

var showPattern = (msg,callback) => {
  //this is executed first before callback in above function
  let id = "#" + computerArray[x];

  //get background color change based on arr[x]
  let initColor;
  let colorChange;
  switch (computerArray[x]) {
    case "green":
      initColor = "#00A756";
      colorChange = "#00FC82";
      break;
    case "red":
      initColor = "#A30A1C";
      colorChange = "#F23148";
      break;
    case "yellow":
      initColor = "#CDA636";
      colorChange = "#DEC47A";
      break;
    case "blue":
      initColor = "#054B8A";
      colorChange = "#0980EC";
      break;
  }
  
  setTimeout(function(){
    $(id).css("background-color", colorChange);
    makeSound(computerArray[x]);
    setTimeout(function(){
      $(id).css("background-color", initColor);
    }, 1000);
  }, 2000);

  // delays next iteration of pattern
  setTimeout(function(){
    callback();
  }, 2000);
};

var reset = () => {
  computerArray = [];
  spotInCount = 0;
  x = -1;
  $("#countScreen").html("--");
}

var startGame = () => {
  reset();
  gameStarted = true;
  computerArray = [];
  computerMove();
}

var pointerStyle = (direction) => {
  if (direction === "on") {
    $("#left").addClass("cursorHover");
    $("#right").addClass("cursorHover");
    $("#strictButton").addClass("cursorHover");
    $("#startButton").addClass("cursorHover");
    $("#green").addClass("cursorHover");
    $("#red").addClass("cursorHover");
    $("#yellow").addClass("cursorHover");
    $("#blue").addClass("cursorHover");
  } else if (direction === "off") {
    $("#left").removeClass("cursorHover");
    $("#right").removeClass("cursorHover");
    $("#strictButton").removeClass("cursorHover");
    $("#startButton").removeClass("cursorHover");
    $("#green").removeClass("cursorHover");
    $("#red").removeClass("cursorHover");
    $("#yellow").removeClass("cursorHover");
    $("#blue").removeClass("cursorHover");
  }
}

var makeSound = (color) => {
  switch (color) {
    case 'green':
      greenAudio.load();
      greenAudio.play();
      break;
    case 'red':
      redAudio.load();
      redAudio.play();
      break;
    case 'yellow':
      yellowAudio.load();
      yellowAudio.play();
      break;
    case 'blue':
      blueAudio.load();
      blueAudio.play();
      break;
  }
}
