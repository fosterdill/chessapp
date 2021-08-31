<script>
  import { onMount } from 'svelte';
  import { game } from './stores/game';

  const onDrop = (source, target) => {
    // see if the move is legal
    const move = $game.move({
      from: source,
      to: target,
      promotion: "q", // NOTE: always promote to a queen for example simplicity
    });


    // illegal move
    if (move === null) return "snapback";

    game.update(game => game);
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

    const board = Chessboard('board', config);
  })
</script>


<div id="board">
</div>
