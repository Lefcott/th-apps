/** @format */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Container from '../../components/Container';

test('renders itself and child components successfully', async () => {
  const text = 'Hello World!';
  render(
    <Container>
      <div data-testid="child-of-root">{text}</div>
    </Container>,
  );

  const root = await screen.findByTestId('TA_auth-root');
  expect(root).toBeInTheDocument();
  const child = await screen.findByTestId('child-of-root');
  expect(child).toHaveTextContent(text);
});
