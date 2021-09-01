<script>
  import { onMount } from 'svelte';
  import { game } from './stores/game';
  let board;

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
  })

  $: board && board.position($game.fen());

</script>

<div id="board">
</div>
