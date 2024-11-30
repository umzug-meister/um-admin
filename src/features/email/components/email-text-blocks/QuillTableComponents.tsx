import { PropsWithChildren } from 'react';

export function QuillTable({ children }: PropsWithChildren) {
  return (
    <table style={{ maxWidth: '600px', width: '100%' }}>
      <tbody>{children}</tbody>
    </table>
  );
}

export function QuillCell({
  children,
  textAlign,
  color,
  fontWeight,
}: PropsWithChildren<{ textAlign?: CanvasTextAlign; color?: string; fontWeight?: 'bold' }>) {
  return (
    <td style={{ border: 0 }}>
      <p style={{ textAlign, color, fontWeight }}>{children}</p>
    </td>
  );
}
