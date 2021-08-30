
<script>
	// Need to figure out how to get this working with 'craftyfox66'
	import localForage from "localforage";
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store'
	import setupAnalyzer from './setupAnalyzer';
	let adv;
	let bMoves;
	let bMove;
	let nextMoves = [];
	let previousMove;
	let color;
	let fenString;
	const username = window.location.hash.slice(1);

	const handleStockfishUpdate = ({ bestMoves, bestMove, cp, depth }) => {
		if (cp) adv = cp 
		if (bestMoves) {
			bMoves = `(${depth}) ${bestMoves}`;
			bMove = null;
		}
		if (bestMove) bMove = `${bestMove}`;
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
		fenString = node.name.replace(/\s/g, '_');

	}
	onMount(async () => {
		color = (await localForage.getItem(`${username}_currentSide`)) || "white";
		previousMove = (await setupAnalyzer(handleStockfishUpdate, handleNodeUpdate, color)).previousMove;
	})

	const toggleColor = async () => {
		color = color === 'white' ? 'black' : 'white';
		localForage.setItem(`${username}_currentSide`, color);
		previousMove = (await setupAnalyzer(handleStockfishUpdate, handleNodeUpdate, color)).previousMove;
	}

	const handleKeyDown = (event) => {
		if (event.key === "ArrowLeft") {
			previousMove();
		}
	}

</script>
<svelte:window on:keydown={handleKeyDown} />

<main>
    <div class="wrapper">
      <div id="progress"></div>
        <a target="_blank" href="https://lichess.org/analysis/{fenString}">Lichess analysis</a>
      <div id="boardcontainer">
        <div id="board"></div>
        <div>
          <button on:click={toggleColor} id="previousmove" type="button" class="btn btn-primary">
          	Toggle side
          </button>
          <button on:click={previousMove}  type="button" class="btn btn-primary">
          	Previous move
          </button>
          <div class="single-line-container">
        	<div class="single-line">
	    <span id="adv">{adv}</span>
	    {#if bMove}
		    <span id="bestMove">{bMove}</span>
		    {:else}
		    <span id="bestMove">{bMoves}</span>
		    {/if}
		</div>
	</div>
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