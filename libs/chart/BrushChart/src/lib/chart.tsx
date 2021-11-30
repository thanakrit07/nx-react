import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ChartProps {}

const StyledChart = styled.div`
  color: pink;
`;

export function Chart(props: ChartProps) {
  return (
    <StyledChart>
      <h1>Welcome to Chart!</h1>
    </StyledChart>
  );
}

export default Chart;
