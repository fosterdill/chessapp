
<script>
	import { onMount } from 'svelte';
	import loadNodes from './load-nodes';
	import Board from './Board.svelte';
	import startStockfish from './stockfish';
	import engine from './stores/engine';
	import { game } from './stores/game';
	import tree from './stores/tree';
	import {START_FEN} from './utils';
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

	const handleGoBack = () => {
		$game.undo();
		game.update(game => game);
		tree.undo();
	}


</script>

<main>
	<div style="padding: 24px 0;">
		<button disabled={$tree.currentNode && $tree.currentNode.name !== START_FEN} on:click={handleToggleSide} type="button" class="btn btn-primary">Toggle side</button>
		<button on:click={handleGoBack} type="button" class="btn btn-primary">Previous move</button>
	</div>
	<div style="display: flex">
		<Board flipped={currentSide === 'black'} />
		<div style="padding-left: 24px">
			<span class="badge bg-secondary">
			{#if $engine.isWorking}
		{$engine.adv || '-'}
				Line: {$engine.line}
			{:else}
		{$engine.adv || '-'}
				Best move: {$engine.bestMove}
			{/if}
		</span>
			{#if $game &&  $tree.currentNode && $tree.currentNode.name === $game.fen()}
				{#each edges as edge}
					<div>
						<span class="badge">{edge.name} (won {edge.accum.win} of {edge.accum.total})</span>
				        <div class="progress" style="width: 400px">
				          <div class="progress-bar" role="progressbar" style={`width: ${Math.round(100 * edge.accum.win / edge.accum.total)}%`} aria-valuenow={Math.round(100 * edge.accum.win / edge.accum.total)} aria-valuemin="0" aria-valuemax="100"></div>
				        </div>
				    </div>
				{/each}
			{:else}
				<div>No positions found</div>
			{/if}
		</div>
	</div>
</main>