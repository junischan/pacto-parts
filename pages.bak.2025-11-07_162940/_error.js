export default function ErrorPage({ statusCode }) {
  return (
    <div style={{padding:20,fontFamily:"system-ui"}}>
      <h1>Ups, algo salió mal</h1>
      <p>Código: {statusCode ?? 'desconocido'}</p>
    </div>
  );
}
ErrorPage.getInitialProps = ({ res, err }) => {
  const code = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode: code };
};
