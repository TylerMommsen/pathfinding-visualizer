'use client';
import { useSelections } from '@/contexts/SelectionsContext';

export default function Info() {
	const { selections } = useSelections();

	return (
		<section id="info">
			<div className="node-colors-info">
				<div className="node-info-item">
					<div id="info-wall"></div>
					<p>Wall</p>
				</div>
				<div className="node-info-item">
					<div id="info-visited"></div>
					<p>Visited</p>
				</div>
				<div className="node-info-item">
					<div id="info-unvisited"></div>
					<p>Unvisited</p>
				</div>
				<div className="node-info-item">
					<div id="info-path"></div>
					<p>Path</p>
				</div>
				<div className="node-info-item">
					<svg
						fill="#000000"
						viewBox="0 0 1920 1920"
						xmlns="http://www.w3.org/2000/svg"
						transform="matrix(-1, 0, 0, 1, 0, 0)"
						width={20}
						height={20}
					>
						<g id="SVGRepo_bgCarrier" strokeWidth="1"></g>
						<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							<path
								d="m1394.006 0 92.299 92.168-867.636 867.767 867.636 867.636-92.299 92.429-959.935-960.065z"
								fillRule="evenodd"
							></path>
						</g>
					</svg>
					<p>Start</p>
				</div>
				<div className="node-info-item">
					<svg
						viewBox="0 0 20 20"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						fill="#000000"
						width={20}
						height={20}
					>
						<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
						<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							{' '}
							<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
								{' '}
								<g
									id="Dribbble-Light-Preview"
									transform="translate(-220.000000, -7759.000000)"
									fill="#000000"
								>
									{' '}
									<g id="icons" transform="translate(56.000000, 160.000000)">
										{' '}
										<path
											d="M174,7611 L178,7611 L178,7607 L174,7607 L174,7611 Z M170,7607 L174,7607 L174,7603 L170,7603 L170,7607 Z M174,7603 L178,7603 L178,7599 L174,7599 L174,7603 Z M182,7599 L182,7603 L178,7603 L178,7607 L182,7607 L182,7619 L184,7619 L184,7599 L182,7599 Z M166,7607 L170,7607 L170,7611 L166,7611 L166,7619 L164,7619 L164,7599 L170,7599 L170,7603 L166,7603 L166,7607 Z"
											id="finish_line-[#104]"
										>
											{' '}
										</path>{' '}
									</g>{' '}
								</g>{' '}
							</g>{' '}
						</g>
					</svg>
					<p>End</p>
				</div>
			</div>
			<p>
				Algorithm Selected:{' '}
				<span style={{ fontWeight: 'bold' }}>
					{selections.selectalgorithm ? selections.selectalgorithm : 'None'}
				</span>{' '}
			</p>
		</section>
	);
}
