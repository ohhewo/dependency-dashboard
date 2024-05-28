// src/components/CalendarHeatmap.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import data from '../data';

const CalendarHeatmap = () => {
  const heatmapRef = useRef();

  useEffect(() => {
    const svg = d3.select(heatmapRef.current)
                  .attr('width', '100%')
                  .attr('height', '100%')
                  .attr('viewBox', '0 0 960 136') // Ensures the content scales
                  .style('background', 'linear-gradient(145deg, #f5f7fa, #c3cfe2)')
                  .style('margin', '10px')
                  .style('padding', '10px')
                  .style('border-radius', '10px')
                  .style('box-shadow', '0 4px 8px rgba(0,0,0,0.1)');

    const format = d3.timeFormat('%Y-%m-%d');

    const color = d3.scaleLinear()
                    .domain([0, 0.5, 1])
                    .range(['#007C43', '#FFA500', '#CE1430']); // Green, Amber, Red

    const parseDate = d3.timeParse('%Y-%m-%d');

    const jobsByDay = d3.rollup(
      data.flatMap(d => d.actualTimings.map(t => ({
        system: d.system,
        date: parseDate(t.startTime.substring(0, 10)),
        withinSLA: new Date(t.finishTime) <= new Date(d.slaTime)
      }))),
      v => ({
        success: v.filter(d => d.withinSLA).length,
        fail: v.filter(d => !d.withinSLA).length,
      }),
      d => d.date
    );

    // Add debugging
    console.log("Jobs by Day:", jobsByDay);

    const years = Array.from(d3.group(Array.from(jobsByDay, ([key, value]) => {
      if (!key) {
        console.error("Invalid date found:", key, value);
      }
      return { date: key, value };
    }), d => d.date?.getUTCFullYear()), ([key, values]) => ({ key, values }));

    const year = svg.selectAll('g')
                    .data(years)
                    .enter().append('g')
                    .attr('transform', (d, i) => `translate(40,${136 * i + 17 * 1.5})`);

    year.append('text')
        .attr('transform', `translate(-6,${17 * 3.5})rotate(-90)`)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text(d => d.key);

    year.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2)
        .selectAll('path')
        .data(d => d3.timeDays(new Date(d.key + '-01-01'), new Date((+d.key + 1) + '-01-01')))
        .enter().append('path')
        .attr('d', d3.timeMonth)
        .attr('transform', d => `translate(${(d3.timeWeek.count(d3.timeYear(d), d) + 1) * 17},0)`);

    year.append('g')
        .selectAll('rect')
        .data(d => d.values)
        .enter().append('rect')
        .attr('width', 17)
        .attr('height', 17)
        .attr('x', d => d3.timeWeek.count(d3.timeYear(d.date), d.date) * 17)
        .attr('y', d => d.date.getUTCDay() * 17)
        .datum(d => {
          const total = d.value.success + d.value.fail;
          const breachRate = total === 0 ? 0 : d.value.fail / total;
          return { date: d.date, value: breachRate };
        })
        .attr('fill', d => color(d.value))
        .append('title')
        .text(d => `${format(d.date)}: ${Math.round(d.value * 100)}% breaches`);

  }, []);

  return <svg ref={heatmapRef}></svg>;
};

export default CalendarHeatmap;
