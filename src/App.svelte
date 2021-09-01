
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

<main>
	<div style="position: fixed; width: 100%">
	<div style="padding: 24px 0;">
		<button on:click={handleGoBack} type="button" class="btn btn-secondary fw-bold">Previous move</button>
	</div>
	<div style="display: flex">
		<Board />
		<div style="padding-left: 24px; width: 100%;">
			<div class="my-dark">
			<div style="padding-bottom: 12px;">
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
				{#each currentEdges($tree) as edge}
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