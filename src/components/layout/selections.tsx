import React from 'react';

export default function Selections({ start, setStart }: any) {
	return (
		<div id="selections">
			<button>Select Algorithm</button>
			<button>Select Maze</button>
			<button>Grid Size</button>
			<button>Maze Speed</button>
			<button>Path Speed</button>
			<button>Reset</button>
			<button id="visualize-btn" onClick={() => setStart(!start)}>
				Start!
			</button>
		</div>
	);
}
