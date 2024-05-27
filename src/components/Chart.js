// src/components/Chart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Chart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    const svg = d3.select(chartRef.current)
                  .attr('width', 800)
                  .attr('height', 400)
                  .style('background', '#f4f4f4')
                  .style('margin', '10px')
                  .style('padding', '10px');

    // Clear existing contents
    svg.selectAll('*').remove();

    // Define scales
    const xScale = d3.scaleTime()
                     .domain([new Date('2024-01-01'), new Date('2024-12-31')])
                     .range([50, 750]);

    const yScale = d3.scaleBand()
                     .domain(data.map(d => d.system))
                     .range([50, 350])
                     .padding(0.1);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(12).tickFormat(d3.timeFormat('%b'));
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
       .attr('transform', 'translate(0,350)')
       .call(xAxis);

    svg.append('g')
       .attr('transform', 'translate(50,0)')
       .call(yAxis);

    // Draw the bars
    data.forEach(system => {
      const systemGroup = svg.append('g').attr('class', 'system-group');

      system.actualTimings.forEach(timing => {
        const startDate = new Date(timing.date + ' ' + timing.startTime);
        const finishDate = new Date(timing.date + ' ' + timing.finishTime);
        const slaDate = new Date(timing.date + ' ' + system.slaTime);

        const withinSLA = finishDate <= slaDate;

        systemGroup.append('rect')
                   .attr('x', xScale(startDate))
                   .attr('y', yScale(system.system))
                   .attr('width', xScale(finishDate) - xScale(startDate))
                   .attr('height', yScale.bandwidth())
                   .attr('fill', withinSLA ? 'green' : 'red');
      });
    });
  }, [data]);

  return <svg ref={chartRef}></svg>;
};

export default Chart;
