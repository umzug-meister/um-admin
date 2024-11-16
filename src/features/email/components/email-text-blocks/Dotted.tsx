import { PropsWithChildren } from 'react';

export function Dotted({ children, style }: PropsWithChildren<{ style?: React.CSSProperties }>) {
  return <p style={style}>•&nbsp;&nbsp;&nbsp;&nbsp;{children}</p>;
}
