import React from 'react';

function OldData({ setShowInfo }) {
  const data = [
    { station: 'Khumaltar', value: 168, category: 'Hazardous' },
    { station: 'Ratnapark', value: 165, category: 'Hazardous' },
    { station: 'Deukhuri, Dang', value: 165, category: 'Hazardous' },
    { station: 'Bharatpur', value: 156, category: 'Unhealthy' },
    { station: 'Bhaktapur', value: 155, category: 'Unhealthy' },
    { station: 'Nepalgunj', value: 105, category: 'Sensitive' },
    { station: 'Dhulikhel', value: 80, category: 'Moderate' },
    { station: 'Ilam', value: 42, category: 'Good' },
    { station: 'Shankapark', value: '-', category: '' },
    { station: 'Achaam', value: '-', category: '' },
  ];

  return (
    <div>
      <table className="oldData tab1">
        <thead>
          <tr>
            <th>Stations (AQI)</th>
            <th>Yesterday 24hr</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index} onMouseEnter={() => setShowInfo(true)}>
              <td className={entry.category}>{entry.station}</td>
              <td className={entry.category}>{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OldData;