// App.jsx
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [regionFilter, setRegionFilter] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
        setFilteredCountries(data);
      });
  }, []);

  useEffect(() => {
    let filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (regionFilter !== 'All') {
      filtered = filtered.filter((country) => country.region === regionFilter);
    }

    if (showFavorites) {
      filtered = filtered.filter((country) => favorites.includes(country.name.common));
    }

    setFilteredCountries(filtered);
  }, [searchTerm, countries, regionFilter, showFavorites, favorites]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  return (
    <div className="app" style={{
      background: darkMode
        ? 'radial-gradient(circle at top left, #1f2937, #111827, #1f2937)'
        : 'radial-gradient(circle at top left, #e0f7fa, #ffffff, #e0f7fa)',
      backdropFilter: 'blur(6px)',
      minHeight: '100vh',
    }}>
      <style>
        {`
          .animated-btn.round-btn {
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            background: linear-gradient(145deg, #3b82f6, #60a5fa);
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
          }

          .animated-btn.round-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          }

          .footer {
            text-align: center;
            padding: 20px;
            color: #ffffff;
            font-weight: bold;
          }

          body.dark .footer {
            color: #f3f4f6;
          }

          body:not(.dark) .footer {
            color: #1f2937;
          }

          .header-line {
            width: 80%;
            margin: 10px auto 20px;
            height: 2px;
            background-color: #ccc;
          }

          body.dark .header-line {
            background-color: #4b5563;
          }
        `}
      </style>
      <header className="header" style={{ color: darkMode ? '#ffffff' : '#000000' }}>
        <h1>🌍 Country Info Explorer</h1>
        <div className="header-line"></div>
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="feature-buttons" style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="animated-btn round-btn" onClick={() => setDarkMode(!darkMode)}>🌙 {darkMode ? 'Light Mode' : 'Dark Mode'}</button>
          <button className="animated-btn round-btn" onClick={() => setRegionFilter('All')}>📌 Reset Region</button>
          <button className="animated-btn round-btn" onClick={() => setShowFavorites(!showFavorites)}>⭐ {showFavorites ? 'Show All' : 'Show Favorites'}</button>
        </div>

        <div className="region-filters" style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'].map((region) => (
            <button className="animated-btn round-btn" key={region} onClick={() => setRegionFilter(region)}>{region}</button>
          ))}
        </div>
      </header>

      <div className="country-list">
        {filteredCountries.map((country, idx) => (
          <div className={`country-card ${darkMode ? 'dark' : ''}`} key={idx}>
            <img src={country.flags.svg} alt={`${country.name.common} flag`} />
            <h2>{country.name.common}</h2>
            <p><strong>Capital:</strong> {country.capital?.[0]}</p>
            <p><strong>Region:</strong> {country.region}</p>
            <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
            <p><strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
            <p><strong>Currency:</strong> {country.currencies ? Object.values(country.currencies)[0].name : 'N/A'}</p>
            <p><strong>Timezones:</strong> {country.timezones?.join(', ')}</p>
            <button
              className="fav-btn"
              onClick={() => {
                const name = country.name.common;
                setFavorites((prev) =>
                  prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
                );
              }}
            >
              {favorites.includes(country.name.common) ? '💔 Remove Favorite' : '❤️ Add to Favorites'}
            </button>
          </div>
        ))}
      </div>

      <footer className="footer">
        Made with ❤️ by Vedant Kankate
      </footer>
    </div>
  );
}

export default App;