<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store'
	import setupAnalyzer from './setupAnalyzer';
	let adv;
	let bMoves;
	let bMove;
	let nextMoves = [];

	const handleStockfishUpdate = ({ bestMoves, bestMove, cp }) => {
		console.log(bestMove);
		if (cp) adv = cp 
		if (bestMoves) {
			bMoves = bestMoves;
			bMove = null;
		}
		if (bestMove) bMove = bestMove;
	}

	const handleNodeUpdate = (node) => {
		nextMoves = Object.values(node.edges).map(({ name, accum }) => {
			return {
				name,
				winPercentage: Math.round(100 * accum.win / accum.total),
				winPercentageStyle: `width: ${Math.round(100 * accum.win / accum.total)}%`,
				total: accum.total,
				won: accum.win
			}
		})
		nextMoves = nextMoves.sort((move, move2) => move2.total - move.total)

	}
	onMount(async () => {
		setupAnalyzer(handleStockfishUpdate, handleNodeUpdate);
	})
</script>

<main>
    <div class="wrapper">
      <div id="progress"></div>
      <div id="boardcontainer">
        <div id="board"></div>
        <div>
        	<div>
	    <span id="adv">{adv}</span>
	    {#if bMove}
		    <span id="bestMove">{bMove}</span>
		    {:else}
		    <span id="bestMove">{bMoves}</span>
		    {/if}
	</div>
          <button id="previousmove" type="button" class="btn btn-primary">
          	Previous move
          </button>
          <div id="nextMoves">
          	{#each nextMoves as { name, winPercentage, winPercentageStyle, won, total}}
				<div>
					{name} (won {won} out of {total})
			        <div class="progress" style="width: 200px">
			          <div class="progress-bar" role="progressbar" style={winPercentageStyle} aria-valuenow={winPercentage} aria-valuemin="0" aria-valuemax="100"></div>
			        </div>
			    </div>
          	{/each}
          </div>
        </div>
      </div>
      <div id="status"></div>
      <div id="lastMove"></div>
    </div>
</main>