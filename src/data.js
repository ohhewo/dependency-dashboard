const data = [
    {
      system: 'System A',
      expectedStartTime: '20:00',
      expectedFinishTime: '22:00',
      slaTime: '22:00',
      actualTimings: [
        { date: '2024-01-01', startTime: '20:05', finishTime: '21:55' }, // Within SLA
        { date: '2024-01-02', startTime: '20:00', finishTime: '22:10' }, // Breached SLA
        // More entries...
      ]
    },
    // More systems...
  ];
  
  export default data;