import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'urlShortenerData';

const generateShortKey = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const UrlShortener = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [urlMap, setUrlMap] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) setUrlMap(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(urlMap));
  }, [urlMap]);

  const handleShorten = () => {
    setError('');

    if (!inputUrl.trim()) {
      setError('Please enter a URL.');
      return;
    }

    if (!isValidUrl(inputUrl)) {
      setError('Invalid URL format.');
      return;
    }

    const existingKey = Object.keys(urlMap).find(
      (key) => urlMap[key].originalUrl === inputUrl
    );
    if (existingKey) {
      alert('URL already shortened.');
      setInputUrl('');
      return;
    }

    let shortKey;
    do {
      shortKey = generateShortKey();
    } while (urlMap[shortKey]);

    const updated = {
      ...urlMap,
      [shortKey]: { originalUrl: inputUrl, clicks: 0 },
    };
    setUrlMap(updated);
    setInputUrl('');
  };

  const handleRedirect = (key) => {
    const entry = urlMap[key];
    if (!entry) return;

    const updatedEntry = { ...entry, clicks: entry.clicks + 1 };
    setUrlMap((prev) => ({ ...prev, [key]: updatedEntry }));
    window.open(entry.originalUrl, '_blank');
  };

  const handleDelete = (key) => {
    const updated = { ...urlMap };
    delete updated[key];
    setUrlMap(updated);
  };

  const baseUrl = window.location.origin;

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: '2rem', fontFamily: 'sans-serif', backgroundColor: 'lightgreen' }}>
      <centre>
      <h1 style={{color: 'red'}}>React URL Shortener</h1>
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Paste your URL here..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
        />
        <button
          onClick={handleShorten}
          style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '1rem', color: 'green', backgroundColor: 'pink' }}
        >
          Shorten
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2 style={{color: 'purple'}}>Shortened URLs</h2>
      {Object.keys(urlMap).length === 0 ? (
        <p>No URLs added yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Generated Short URL</th>
              <th style={thStyle}>Original URL You Entered</th>
              <th style={thStyle}>No.of Clicks</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(urlMap).map(([key, { originalUrl, clicks }]) => (
              <tr key={key}>
                <td style={tdStyle}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRedirect(key);
                    }}
                  >
                    {baseUrl}/{key}
                  </a>
                </td>
                <td style={tdStyle}>{originalUrl}</td>
                <td style={tdStyle}>{clicks}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDelete(key)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      backgroundColor: 'Blue',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </centre>
    </div>
  );
};

const thStyle = {
  borderBottom: '1px solid red',
  padding: '0.5rem',
  textAlign: 'center',
};

const tdStyle = {
  padding: '0.5rem',
  borderBottom: '1px solid red',
  wordBreak: 'break-word',
};
export default UrlShortener;
