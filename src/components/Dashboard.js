// src/components/Dashboard.js
import React, { useState } from 'react';
import Chart from './Chart';
import PredictedEndTimesTable from './PredictedEndTimesTable';

const Dashboard = () => {
  const [predictedEndTimes, setPredictedEndTimes] = useState([]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">My Dashboard</div>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Transactions</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </nav>
      </div>
      <div className="main-content">
        <div className="chart-container">
          <Chart setPredictedEndTimes={setPredictedEndTimes} />
        </div>
        <div className="table-container">
          <PredictedEndTimesTable data={predictedEndTimes} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
