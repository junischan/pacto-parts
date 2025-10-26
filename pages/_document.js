import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
