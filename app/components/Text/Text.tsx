type Kind = 'headline/h1';

// const styles: Record<Kind, React.CSSProperties> = {
//
//   'headline/h1': { fontSize:  },
// };
export function Text({ kind, ...props }) {
  return <div {...props}></div>;
}
