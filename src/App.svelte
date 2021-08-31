
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



</script>

<main>
	<div style="position: fixed; width: 100%">
	<div style="padding: 24px 0;">
		<button disabled={$tree.currentNode && $tree.currentNode.name !== START_FEN} on:click={handleToggleSide} type="button" class="btn btn-secondary fw-bold">Toggle side</button>
		<button on:click={game.handleGoBack} type="button" class="btn btn-secondary fw-bold">Previous move</button>
	</div>
	<div style="display: flex">
		<Board flipped={currentSide === 'black'} />
		<div style="padding-left: 24px; width: 100%;">
			<div class="my-dark">
			<div style="padding-bottom: 12px;">
			{#if $engine.adv}
				{#if $engine.adv > 0}
					<span class="badge bg-light text-dark fs-6">{$engine.adv}</span>
				{:else if $engine.adv === 0}
					<span class="badge bg-secondary fs-6">{$engine.adv}</span>
				{:else}
					<span class="badge bg-dark fs-6">{$engine.adv}</span>
				{/if}
			{:else}
				<span class="badge bg-secondary fs-6">...</span>

			{/if}
			</div>
			<span style="margin-bottom: 12px" class="badge bg-secondary fs-6">
			{#if $engine.isWorking}
				🤔 {$engine.line}
			{:else}
				🌟 {$engine.bestMove}
			{/if}
			</span>
		</div>
		</div>
	</div>
</div>
<div class="rightColumn">
	<div>
			{#if $game &&  $tree.currentNode && $tree.currentNode.name === $game.fen()}
				{#each edges as edge}
					<div>
						<span class="badge fs-6">{edge.name} (won {edge.accum.win} of {edge.accum.total})</span>
				        <div class="progress" style="width: 400px">
				          <div class="progress-bar bg-info" role="progressbar" style={`width: ${Math.round(100 * edge.accum.win / edge.accum.total)}%`} aria-valuenow={Math.round(100 * edge.accum.win / edge.accum.total)} aria-valuemin="0" aria-valuemax="100"></div>
				        </div>
				    </div>
				{/each}
			{:else}
				<div>No positions found</div>
			{/if}
		</div>
	</div>
</main>