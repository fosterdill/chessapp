<script>
  import { onMount } from 'svelte';
  import { game } from './stores/game';
  let board;
  export let flipped = false;

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

    board = Chessboard('board', config);
  })

  $: board && board.orientation(flipped ? 'black' : 'white')
  
  game.subscribe(game => {
    board && board.position(game.fen());
  })
</script>


<div id="board">
</div>
