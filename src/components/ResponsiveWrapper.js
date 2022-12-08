import styled from "styled-components";

const breakpoints = {
	sm: 480,
	md: 768,
	lg: 1024,
	xl: 1200
}

const ResponsiveWrapper = styled.div`
		@media (min-width: ${breakpoints.sm}px){
			width: 90vw
		}
		@media (min-width: ${breakpoints.md}px){
			width: 80vw
		}
		@media (min-width: ${breakpoints.lg}px){
			width: 70vw
		}
		@media (min-width: ${breakpoints.xl}px){
			width: 60vw
		}
	`

export default ResponsiveWrapper;
