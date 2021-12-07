import styled from 'styled-components';
import { BrushChart } from '@nx-react-test/chart/BrushChart';
const Container = styled.div`
  width: 500px;
  height: 500px;
`;

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.styled-components file.
   */
  return (
    <Container>
      <BrushChart />
    </Container>
  );
}

export default Index;
