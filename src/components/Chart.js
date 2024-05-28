// src/components/Chart.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import data from '../data';

const Chart = ({ setPredictedEndTimes }) => {
  const chartRef = useRef();
  const [showExpected, setShowExpected] = useState(false);

  useEffect(() => {
    const svg = d3.select(chartRef.current)
                  .attr('width', '100%')
                  .attr('height', '100%')
                  .attr('viewBox', '0 0 800 400') // Ensures the content scales
                  .style('background', 'linear-gradient(145deg, #f5f7fa, #c3cfe2)') // Gradient background
                  .style('border-radius', '10px')
                  .style('box-shadow', '0 4px 8px rgba(0,0,0,0.1)');

    // Clear existing contents
    svg.selectAll('*').remove();

    // Define scales
    const xScale = d3.scaleTime()
                     .domain([new Date('2024-01-01T00:00:00'), new Date('2024-12-31T23:59:59')])
                     .range([50, 750]);

    const yScale = d3.scaleBand()
                     .domain(data.map(d => d.system))
                     .range([50, 350])
                     .padding(0.1);

    const xAxis = svg.append('g')
                     .attr('transform', 'translate(0,350)')
                     .call(d3.axisBottom(xScale).ticks(12).tickFormat(d3.timeFormat('%b')))
                     .style('color', '#555'); // Light grey for text

    const yAxis = svg.append('g')
                     .attr('transform', 'translate(50,0)')
                     .call(d3.axisLeft(yScale).tickSize(0).tickPadding(10))
                     .style('color', '#555'); // Light grey for text

    // Remove default Y-axis line
    yAxis.selectAll("line").remove();

    const tooltip = d3.select('body').append('div')
                      .attr('class', 'tooltip')
                      .style('position', 'absolute')
                      .style('visibility', 'hidden')
                      .style('background', '#333')
                      .style('color', '#fff')
                      .style('border', '1px solid #ccc')
                      .style('padding', '10px')
                      .style('border-radius', '4px');

    const calculatePredictedEndTimes = () => {
      const predictions = [];

      data.forEach(system => {
        system.actualTimings.forEach(timing => {
          const finishDate = new Date(timing.finishTime);
          const slaDate = new Date(system.slaTime);

          const withinSLA = finishDate <= slaDate;
          if (!withinSLA) {
            system.dependencies.forEach(dep => {
              const dependentSystem = data.find(d => d.system === dep.system);
              const depTiming = dependentSystem.actualTimings.find(t => new Date(t.startTime).toDateString() === new Date(timing.startTime).toDateString());
              if (depTiming) {
                const depFinishDate = new Date(depTiming.finishTime);
                const predictedEndDate = new Date(depFinishDate.getTime() + (finishDate.getTime() - slaDate.getTime()));
                predictions.push({
                  system: dep.system,
                  originalEndDate: depFinishDate,
                  predictedEndDate
                });
              }
            });
          }
        });
      });

      setPredictedEndTimes(predictions);
    };

    const updateChart = (newXScale) => {
      svg.selectAll('.system-group').remove();

      data.forEach(system => {
        const systemGroup = svg.append('g').attr('class', 'system-group');

        system.actualTimings.forEach(timing => {
          const startDate = new Date(timing.startTime);
          const finishDate = new Date(timing.finishTime);
          const slaDate = new Date(system.slaTime);

          const withinSLA = finishDate <= slaDate;

          const rectWidth = newXScale(finishDate) - newXScale(startDate);
          if (rectWidth < 0) {
            console.error('Invalid rectangle width:', rectWidth);
            return;
          }

          systemGroup.append('rect')
                     .attr('x', newXScale(startDate))
                     .attr('y', yScale(system.system))
                     .attr('width', rectWidth)
                     .attr('height', yScale.bandwidth())
                     .attr('fill', withinSLA ? '#007C43' : '#CE1430') // Green for within SLA, Red for breached SLA
                     .on('mouseover', () => {
                       tooltip.style('visibility', 'visible')
                              .html(`<strong>${system.system}</strong><br>
                                     Start: ${startDate.toLocaleString()}<br>
                                     Finish: ${finishDate.toLocaleString()}<br>
                                     SLA: ${withinSLA ? 'Met' : 'Breached'}`);
                     })
                     .on('mousemove', (event) => {
                       tooltip.style('top', (event.pageY - 10) + 'px')
                              .style('left', (event.pageX + 10) + 'px');
                     })
                     .on('mouseout', () => {
                       tooltip.style('visibility', 'hidden');
                     });

          if (showExpected) {
            const expectedStartDate = new Date(system.expectedStartTime);
            const expectedFinishDate = new Date(system.expectedFinishTime);

            systemGroup.append('line')
                       .attr('x1', newXScale(expectedStartDate))
                       .attr('y1', yScale(system.system))
                       .attr('x2', newXScale(expectedStartDate))
                       .attr('y2', yScale(system.system) + yScale.bandwidth())
                       .attr('stroke', '#00838A') // Teal color for expected times
                       .attr('stroke-width', 2)
                       .attr('stroke-dasharray', '5,5');

            systemGroup.append('line')
                       .attr('x1', newXScale(expectedFinishDate))
                       .attr('y1', yScale(system.system))
                       .attr('x2', newXScale(expectedFinishDate))
                       .attr('y2', yScale(system.system) + yScale.bandwidth())
                       .attr('stroke', '#00838A') // Teal color for expected times
                       .attr('stroke-width', 2)
                       .attr('stroke-dasharray', '5,5');
          }
        });
      });
    };

    const zoomed = (event) => {
      const newXScale = event.transform.rescaleX(xScale);

      let tickFormat;
      const diff = newXScale.domain()[1] - newXScale.domain()[0];

      if (diff < 1000 * 60 * 60 * 24) { // Less than a day
        tickFormat = d3.timeFormat('%H:%M');
      } else if (diff < 1000 * 60 * 60 * 24 * 30) { // Less than a month
        tickFormat = d3.timeFormat('%d %b');
      } else if (diff < 1000 * 60 * 60 * 24 * 365) { // Less than a year
        tickFormat = d3.timeFormat('%b');
      } else {
        tickFormat = d3.timeFormat('%Y');
      }

      xAxis.call(d3.axisBottom(newXScale).ticks(12).tickFormat(tickFormat));
      updateChart(newXScale);
    };

    const zoom = d3.zoom()
                   .scaleExtent([1, 1000]) // Allows zooming in further
                   .translateExtent([[0, 0], [800, 400]])
                   .extent([[0, 0], [800, 400]])
                   .on('zoom', zoomed);

    svg.call(zoom);
    updateChart(xScale); // Initial rendering
    calculatePredictedEndTimes(); // Calculate predictions after rendering

  }, [showExpected, setPredictedEndTimes]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <button onClick={() => setShowExpected(!showExpected)} style={{ backgroundColor: '#009EBE', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
        Toggle Expected Times
      </button>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default Chart;
