
<script>
	import { onMount } from 'svelte';
	import loadNodes from './load-nodes';
	import Board from './Board.svelte';
	import startStockfish from './stockfish';
	import engine from './stores/engine';
	import tree from './stores/tree';

	let edges = [];
	onMount(async () => {
		const { whiteNodes, blackNodes } = await loadNodes(window.location.hash.slice(1));
		tree.loadNodes(whiteNodes);
		edges = tree.currentEdges();

		startStockfish();
	})

	tree.subscribe(() => {
		edges = tree.currentEdges();
	})

</script>

<main>
	<Board />
	{$engine.adv || '-'}
	{#if $engine.isWorking}
		Line: {$engine.line}
	{:else}
		Best move: {$engine.bestMove}
	{/if}
	{#each edges as edge}
		<div>
			{edge.name}
	        <div class="progress" style="width: 200px">
	          <div class="progress-bar" role="progressbar" style={`width: ${Math.round(100 * edge.accum.win / edge.accum.total)}%`} aria-valuenow={Math.round(100 * edge.accum.win / edge.accum.total)} aria-valuemin="0" aria-valuemax="100"></div>
	        </div>
	    </div>
	{/each}
</main>