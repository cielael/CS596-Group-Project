<script>

	let state; 

	//Connecting to websocket
	const socket = new WebSocket("ws://localhost:3000");
	socket.addEventListener('open', function (event) {
    console.log("ws connection open");
	});
	socket.addEventListener('message', function (event) {
    console.log(event.data);
	state = event.data;
	});

	let counter = 0;
	

	

	function toggle(){
		//send message to ws server
		state = state === "unlocked" ? "locked" : "unlocked";
		socket.send(state);
		
	}
</script>

<style>
	.mainbody{
		background-color:gray;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: absolute;

		width: 100%;
		bottom: 20px;
		top: 40px;

	}
	.mainButton{
		height: 20%;
		width: 30%;
		border-radius: 12px;
		font-size: 300%;


	}
	
</style>

<div class="mainbody">
	<h1>Current State: {state}</h1>
	<button class="mainButton" on:click={toggle}>Toggle</button>



</div>
