// src/data.js
const data = [
  {
      system: 'System A',
      expectedStartTime: '2024-01-01T20:00:00',
      expectedFinishTime: '2024-01-01T22:00:00',
      slaTime: '2024-01-01T22:30:00',
      runDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      actualTimings: [
          { startTime: '2024-01-01T20:05:00', finishTime: '2024-01-01T22:10:00' }, // Breached SLA
          { startTime: '2024-01-02T20:00:00', finishTime: '2024-01-02T21:55:00' } // Within SLA
      ],
      dependencies: [
          { system: 'System B', day: 'Monday' },
          { system: 'System B', day: 'Tuesday' }
          // More dependencies...
      ]
  },
  {
      system: 'System B',
      expectedStartTime: '2024-01-01T22:00:00',
      expectedFinishTime: '2024-01-02T00:00:00',
      slaTime: '2024-01-02T00:30:00',
      runDays: ['Saturday', 'Sunday'],
      actualTimings: [
          { startTime: '2024-01-01T01:10:00', finishTime: '2024-01-01T02:10:00' }, // Breached SLA, dependent on System A
          { startTime: '2024-01-02T11:00:00', finishTime: '2024-01-03T00:10:00' }, // Within SLA
          // More entries...
      ],
      dependencies: []
  },
  // More systems...
];

export default data;
