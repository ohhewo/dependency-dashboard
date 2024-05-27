// src/components/PredictedEndTimesTable.js
import React from 'react';

const PredictedEndTimesTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No predicted end times available.</div>;
  }

  return (
    <div>
      <h2 style={{ color: '#555' }}>Predicted End Times</h2>
      <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse', backgroundColor: '#fff', color: '#555', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>System</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Original End Time</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Predicted End Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{d.system}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{d.originalEndDate.toLocaleString()}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{d.predictedEndDate.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PredictedEndTimesTable;
