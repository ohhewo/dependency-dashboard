// src/components/Dashboard.js
import React from 'react';
import Chart from './Chart';
import data from '../data';

const Dashboard = () => {
  return (
    <div>
      <h1>System SLA Dashboard</h1>
      <Chart data={data} />
    </div>
  );
};

export default Dashboard;
