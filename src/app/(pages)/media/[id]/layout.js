export async function generateMetadata({ params }) {
  return {
    title: `Media Details - Alajmi Company`,
    description: 'View detailed information about our company media and achievements',
  };
}

export default function MediaDetailLayout({ children }) {
  return children;
}
