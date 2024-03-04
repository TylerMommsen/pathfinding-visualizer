'use client';
import { useSelections } from '@/contexts/SelectionsContext';
import Image from 'next/image';

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
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						width={20}
						height={20}
					>
						<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
						<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							{' '}
							<path
								d="M5.75 1C6.16421 1 6.5 1.33579 6.5 1.75V3.6L8.22067 3.25587C9.8712 2.92576 11.5821 3.08284 13.1449 3.70797L13.3486 3.78943C14.9097 4.41389 16.628 4.53051 18.2592 4.1227C19.0165 3.93339 19.75 4.50613 19.75 5.28669V12.6537C19.75 13.298 19.3115 13.8596 18.6864 14.0159L18.472 14.0695C16.7024 14.5119 14.8385 14.3854 13.1449 13.708C11.5821 13.0828 9.8712 12.9258 8.22067 13.2559L6.5 13.6V21.75C6.5 22.1642 6.16421 22.5 5.75 22.5C5.33579 22.5 5 22.1642 5 21.75V1.75C5 1.33579 5.33579 1 5.75 1Z"
								fill="#292929"
							></path>{' '}
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

				<div className="node-info-item">
					<Image src="/left-click-icon.svg" width={20} height={20} alt="left click icon" />
					Place Wall
				</div>
				<div className="node-info-item">
					<Image src="/right-click-icon.svg" width={20} height={20} alt="left click icon" />
					Remove Wall
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
