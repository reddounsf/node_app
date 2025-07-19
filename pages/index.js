export default function Home() {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Image Server</h1>
        <p>
          Use <code>/api/image?name=12345.png</code> with Basic Auth.
        </p>
      </div>
    );
  }
