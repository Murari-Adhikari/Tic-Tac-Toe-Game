
      const boardElem = document.querySelector(".board");
      const titleElem = document.querySelector(".title");
      const resetButton = document.querySelector("button");
      const moveHistoryList = document.querySelector(".historyMoves");

      let currentMove = 0;
      let buttonsActive = true;
      let moveHistory = [];
      let replayingHistory = false;
      let playerNames = { player1: "", player2: "" };

      function collectPlayerNames() {
        playerNames.player1 = prompt("Enter Player 1's name:");
        playerNames.player2 = prompt("Enter Player 2's name:");

        if (!playerNames.player1) {
          playerNames.player1 = "Player 1";
        }
        if (!playerNames.player2) {
          playerNames.player2 = "Player 2";
        }

        displayNextMove();
      }

      collectPlayerNames();

      for (let i = 0; i < 3; i++) {
        const newRow = document.createElement("div");
        newRow.className = "row";

        for (let i = 0; i < 3; i++) {
          let newSquare = document.createElement("div");
          newSquare.className = "square";

          newRow.appendChild(newSquare);

          newRow.addEventListener("click", handleClick);
          newRow.addEventListener("mouseover", handleMouseOver);
          newRow.addEventListener("mouseout", handleMouseOut);
        }

        boardElem.appendChild(newRow);
      }

      const allSquares = boardElem.querySelectorAll(".square");

      function resetBoard() {
        allSquares.forEach((square) => (square.innerHTML = ""));

        currentMove = 0;
        displayNextMove();
        resetButton.style.display = "none";
        buttonsActive = true;

        if (!replayingHistory) moveHistoryList.innerHTML = "";
      }
      resetBoard();

      function displayNextMove() {
        titleElem.innerHTML = `Next: ${
          currentMove % 2 === 0 ? playerNames.player1 : playerNames.player2
        }`;
      }

      function handleMouseOver(e) {
        if (!buttonsActive) return;

        if (e.target.innerHTML === "") {
          e.target.style.backgroundColor = "#87CEEB";
        } else {
          e.target.style.backgroundColor = "#DC143C";
        }
      }

      function handleMouseOut(e) {
        e.target.style.backgroundColor = "";
      }

      function goBackToMove(moveNum) {
        replayingHistory = true;

        resetBoard();
        for (let i = 0; i <= moveNum; i++) {
          let moveFromHistory = moveHistory[i];
          allSquares[moveFromHistory].click();
        }

        replayingHistory = false;
      }

      function addToMoveHistory(square) {
        let currentMoveIdx = -1;
        for (let i = 0; i < allSquares.length; i++) {
          if (allSquares[i] === square) {
            currentMoveIdx = i;
          }
        }
        moveHistory.push(currentMoveIdx);

        let newItem = document.createElement("li");
        newItem.innerHTML = `Move #${currentMove + 1}`;
        moveHistoryList.appendChild(newItem);

        let localCurrentMove = currentMove;
        newItem.addEventListener("click", function () {
          goBackToMove(localCurrentMove);
        });
      }

      function trimHistoryToCurrent() {
        moveHistory = moveHistory.slice(0, currentMove);

        const allListItems = document.querySelectorAll(".historyMoves li");
        for (let i = currentMove; i < allListItems.length; i++) {
          allListItems[i].remove();
        }
      }

      function handleClick(e) {
        if (!buttonsActive) return;
        if (e.target.innerHTML !== "") return;
        if (!replayingHistory) {
          if (currentMove < moveHistory.length) trimHistoryToCurrent();

          addToMoveHistory(e.target);
        }

        let playerToken = "";

        if (currentMove % 2 === 0) playerToken = "X";
        else playerToken = "O";

        e.target.innerHTML = playerToken;

        let allPlayerPositions = "";
        allSquares.forEach((square, idx) => {
          if (square.innerHTML === playerToken) allPlayerPositions += idx;
        });

        let winnerFound = checkWinner(allPlayerPositions);
        if (winnerFound !== "") {
          titleElem.innerHTML = `Wow, good job 🏆😊: ${
            currentMove % 2 === 0 ? playerNames.player1 : playerNames.player2
          }`;
          for (const pos of winnerFound) {
            allSquares[parseInt(pos)].style.color = "green";
          }
          gameOver();
        } else {
          if (currentMove === 8) {
            titleElem.innerHTML = `Oh! Try again 😔`;
            gameOver();
          } else {
            currentMove += 1;
            displayNextMove();
          }
        }
      }

      const winningCombos = [
        "012",
        "345",
        "678",
        "036",
        "147",
        "258",
        "048",
        "246",
      ];
      function checkWinner(allPositions) {
        for (const combo of winningCombos) {
          let allThere = true;
          for (const pos of combo) {
            if (!allPositions.includes(pos)) {
              allThere = false;
              break;
            }
          }
          if (allThere) return combo;
        }
        return "";
      }

      function gameOver() {
        buttonsActive = false;
        resetButton.style.display = "block";
      }

      resetButton.addEventListener("click", resetBoard);