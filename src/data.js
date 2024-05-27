// src/data.js
const data = [
    {
      system: 'System A',
      expectedStartTime: '20:00',
      expectedFinishTime: '22:00',
      slaTime: '22:00',
      runDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      actualTimings: [
        { date: '2024-01-01', startTime: '20:05', finishTime: '22:10' }, // Breached SLA
        { date: '2024-01-02', startTime: '20:00', finishTime: '21:55' }, // Within SLA
        // More entries...
      ],
      dependencies: [
        { system: 'System B', day: 'Monday' },
        { system: 'System B', day: 'Tuesday' }
        // More dependencies...
      ]
    },
    {
      system: 'System B',
      expectedStartTime: '22:00',
      expectedFinishTime: '00:00',
      slaTime: '00:00',
      runDays: ['Saturday', 'Sunday'],
      actualTimings: [
        { date: '2024-01-01', startTime: '01:10', finishTime: '02:10' }, // Breached SLA, dependent on System A
        { date: '2024-01-02', startTime: '11:00', finishTime: '00:10' }, // Within SLA
        // More entries...
      ],
      dependencies: []
    },
    {
        system: 'System C',
        expectedStartTime: '20:00',
        expectedFinishTime: '22:00',
        slaTime: '22:00',
        runDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        actualTimings: [
          { date: '2024-01-01', startTime: '10:05', finishTime: '22:10' }, // Breached SLA
          { date: '2024-01-02', startTime: '20:00', finishTime: '21:55' }, // Within SLA
          // More entries...
        ],
        dependencies: [
          { system: 'System A', day: 'Monday' },
          { system: 'System A', day: 'Tuesday' }
          // More dependencies...
        ]
      },

  ];
  
  export default data;
  