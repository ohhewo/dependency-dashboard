// src/components/Dashboard.js
import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import Chart from './Chart';
import CalendarHeatmap from './CalendarHeatmap';
import PredictedEndTimesTable from './PredictedEndTimesTable';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Dashboard.css'; // Custom CSS for additional styling

const Dashboard = () => {
  const [predictedEndTimes, setPredictedEndTimes] = useState([]);

  // Define the layout for the grid items
  const layout = [
    { i: 'chart', x: 0, y: 0, w: 6, h: 4 },
    { i: 'heatmap', x: 6, y: 0, w: 6, h: 4 },
    { i: 'table', x: 0, y: 4, w: 12, h: 4 }
  ];

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
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}
          margin={[20, 20]} // Add margins to prevent overlapping
          preventCollision={true} // Prevent overlap
          compactType={null} // Disable compacting to maintain exact position
          draggableHandle=".drag-handle"
        >
          <div key="chart" className="grid-item">
            <div className="drag-handle">Chart</div>
            <Chart setPredictedEndTimes={setPredictedEndTimes} />
          </div>
          <div key="heatmap" className="grid-item">
            <div className="drag-handle">Heatmap</div>
            <CalendarHeatmap />
          </div>
          <div key="table" className="grid-item">
            <div className="drag-handle">Predicted End Times</div>
            <PredictedEndTimesTable data={predictedEndTimes} />
          </div>
        </GridLayout>
      </div>
    </div>
  );
};

export default Dashboard;
