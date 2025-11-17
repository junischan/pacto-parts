import '../styles/globals.css';
import dynamic from 'next/dynamic';
const CompactMetaBarPRO = dynamic(() => import('../components/CompactMetaBar_pro'), { ssr: false });

export default function App({ Component, pageProps }) {
  return (
    <>
      <CompactMetaBarPRO baseSpeed={3.4} friction={0.92} maxFling={28} />
      <Component {...pageProps} />
    </>
  );
}
