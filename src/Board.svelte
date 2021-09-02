<script>
  import { onMount } from 'svelte';
  import { game } from './stores/game';
  let board;
  let boardElement;

  const onDrop = (source, target) => {
    // see if the move is legal
    const move = $game.move({
      from: source,
      to: target,
      promotion: "q", // NOTE: always promote to a queen for example simplicity
    });


    // illegal move
    if (move === null) return "snapback";

    game.set($game);
  }


  onMount(() => {
    const config = {
      pieceTheme: (piece) => {
        return require(`./images/${piece}.png`);
      },
      draggable: true,
      position: 'start',
      onDrop, 
      onSnapEnd: () => {
       board.position($game.fen());
      }
    };

    board = Chessboard('board', config);
    boardElement.style.width = `${Math.min(window.innerHeight, window.innerWidth) * 0.8}px`;
    board.resize();
  })

  $: board && board.position($game.fen());

  const handleGoBack = (event) => {
    if (event.key === 'ArrowLeft') {
      $game.undo();
      game.set($game);
    }
  };
</script>

<style>
  #board {
    margin: 0 24px;
  }
</style>
<svelte:window on:keydown={handleGoBack} />

<div bind:this={boardElement} id="board">
</div>
