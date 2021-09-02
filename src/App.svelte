
<script>
	import { onMount } from 'svelte';
	import loadNodes from './load-nodes';
	import Board from './Board.svelte';
	import startStockfish, { setPosition } from './stockfish';
	import engine from './stores/engine';
	import { game } from './stores/game';
	import { nodes } from './stores/nodes';
	import { currentEdges, tree } from './stores/tree';
	import {START_FEN} from './utils';

	let whiteNodes, blackNodes;
	let currentSide = 'white';
	let lastAdv;


	onMount(async () => {
		const allNodes = await loadNodes(window.location.hash.slice(1));
		whiteNodes = allNodes.whiteNodes;
		blackNodes = allNodes.blackNodes;

		nodes.set(whiteNodes[START_FEN]);

		startStockfish();

		game.subscribe((game) => {
			setPosition(game);
		})
	})

	engine.subscribe(($engine) => {
		if ($engine.adv || $engine.adv === 0) {
			lastAdv = $engine.adv;
		}
	})

	const handleGoBack = () => {
		$game.undo();
		game.set($game);
	}

</script>

<style>
	:global(body) {
		background-color:  rgb(40, 41, 35);
	}

  :global(body), :global(html), main {
    height:  100%;
  }


  .mainPage {
    width:  100%;
    height:  100%;
    display:  flex;
    align-items: center;
  }

  .mainSection {
    width:  100%;
    height:  80%;
  }

  .progressRows {
    overflow:  scroll;
    height:  80%;
  }

</style>

<main>
	<div class="mainPage">
    <div>
  		<Board />
    </div>
    <div class="mainSection mx-5">
      <div class="mb-2">
        <button on:click={handleGoBack} type="button" class="btn btn-secondary fw-bold">Back</button>
      </div>
      <div class="mb-4">
        {#if lastAdv}
          {#if lastAdv > 0}
            <span class="badge bg-light text-dark fs-6">{lastAdv}</span>
          {:else if lastAdv === 0}
            <span class="badge bg-secondary fs-6">{lastAdv}</span>
          {:else}
            <span class="badge bg-dark fs-6">{lastAdv}</span>
          {/if}
        {:else}
          <span class="badge bg-secondary fs-6">...</span>
        {/if}
        <span class="badge bg-secondary fs-6">
          {#if $engine.isWorking}
            🤔 {$engine.line}
          {:else}
            🌟 {$engine.bestMove}
          {/if}
        </span>
      </div>
      <div class="progressRows">
        {#if $game &&  $tree.currentNode && $tree.currentNode.name === $game.fen()}
          {#each currentEdges($tree) as edge}
            <div class="mb-2">
              <span class="badge fs-6">{edge.name} (won {edge.accum.win} of {edge.accum.total})</span>
                  <div class="progress">
                    <div class="progress-bar bg-info" role="progressbar" style={`width: ${Math.round(100 * edge.accum.win / edge.accum.total)}%`} aria-valuenow={Math.round(100 * edge.accum.win / edge.accum.total)} aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
              </div>
          {/each}
        {:else}
          <div>No positions found</div>
        {/if}
      </div>
    </div>
  </div>
</main>