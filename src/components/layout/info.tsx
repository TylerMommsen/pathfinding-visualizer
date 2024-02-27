import React from 'react';

export default function Info() {
	return (
		<section id="info">
			<div className="node-colors-info">
				<div className="node-info-item">
					<div id="info-wall"></div>
					<p>- Wall</p>
				</div>
				<div className="node-info-item">
					<div id="info-visited"></div>
					<p>- Visited</p>
				</div>
				<div className="node-info-item">
					<div id="info-unvisited"></div>
					<p>- Unvisited</p>
				</div>
				<div className="node-info-item">
					<div id="info-path"></div>
					<p>- Path</p>
				</div>
				<div className="node-info-item">
					<div id="info-start"></div>
					<p>- Start</p>
				</div>
				<div className="node-info-item">
					<div id="info-end"></div>
					<p>- End</p>
				</div>
			</div>
		</section>
	);
}
