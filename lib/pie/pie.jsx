import React    from 'react';
import * as d3  from 'd3';

class Pie extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var context, width, height, data, group, count, radius, colors, arc, labelArc, pie, svg, g;

    width    =  this.props.width;
    height   =  this.props.height;

    group    =  this.props.group;
    count    =  this.props.count;
    data     =  this.props.data;

    radius   =  Math.min(width, height) / 2;
    colors   =  d3.scaleOrdinal(d3.schemeCategory20);

    arc      =  d3.arc()
                  .outerRadius(radius - 10)
                  .innerRadius(0);

    labelArc =  d3.arc()
                  .outerRadius(radius - 40)
                  .innerRadius(radius - 40);

    pie      =  d3.pie()
                  .value(d => d[count]);

    svg      =  d3.select('#pie').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                  .append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    g        =  svg.selectAll('.arc').data(pie(data))
                  .enter().append('g')
                    .attr('class', arc);
              
    g.append('path')
        .attr('d', arc)
      .style('fill', d => colors(d.data[group]));
              
    g.append('text')
        .attr('transform', d => 'translate(' + labelArc.centroid(d) + ')')
        .attr("dy", ".35em")
      .text(d => d.data[group]);

  }

  render() {
    return (
      <div id='pie'>
      </div>
    )
  }
}

Pie.propTypes = {
  data: React.PropTypes.array.isRequired,
  group: React.PropTypes.string.isRequired,
  count: React.PropTypes.string.isRequired
}

Pie.defaultProps = {
  width: 960,
  height: 500
}

export default Pie;