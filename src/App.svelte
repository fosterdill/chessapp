
<script>
	import { onMount } from 'svelte';
	import loadNodes from './load-nodes';
	import Board from './Board.svelte';
	import startStockfish from './stockfish';
	import engine from './stores/engine';
	import tree from './stores/tree';
	let whiteNodes, blackNodes, nodes;
	let currentSide = 'white';
	let edges = [];
	onMount(async () => {
		nodes = await loadNodes(window.location.hash.slice(1));
		whiteNodes = nodes.whiteNodes;
		blackNodes = nodes.blackNodes;

		tree.loadNodes(whiteNodes);
		edges = tree.currentEdges();

		startStockfish();
	})

	tree.subscribe(() => {
		edges = tree.currentEdges();
	})

	const handleToggleSide = () => {
		if (currentSide === 'white') {
			tree.loadNodes(blackNodes);
			currentSide = 'black';
		} else {
			tree.loadNodes(whiteNodes);
			currentSide = 'white';
		}

		edges = tree.currentEdges();
	}

</script>

<main>
	<button on:click={handleToggleSide} type="button" class="btn btn-primary">Toggle side</button>
	<Board flipped={currentSide === 'black'} />
	{$engine.adv || '-'}
	{#if $engine.isWorking}
		Line: {$engine.line}
	{:else}
		Best move: {$engine.bestMove}
	{/if}
	{#each edges as edge}
		<div>
			{edge.name} (won {edge.accum.win} of {edge.accum.total})
	        <div class="progress" style="width: 200px">
	          <div class="progress-bar" role="progressbar" style={`width: ${Math.round(100 * edge.accum.win / edge.accum.total)}%`} aria-valuenow={Math.round(100 * edge.accum.win / edge.accum.total)} aria-valuemin="0" aria-valuemax="100"></div>
	        </div>
	    </div>
	{/each}
</main>