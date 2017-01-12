import React from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import usamap from './usamap.json';


class ZoomableMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      centered: null,
      options: {
        // 'polyFill': this.props.polyFill || 'none',

      }
    }
    this.click = this.click.bind(this);

  }

  componentDidMount() {
    var svg, projection, path, background, g;

    svg         = d3.select('.zoomableMap');
    projection  = d3.geoAlbersUsa().scale(1070).translate([480, 250]);
    path        = d3.geoPath().projection(projection);
    background  = svg.append('rect')
                    .attr('width', this.props.width)
                    .attr('height', this.props.height)
                    .attr('fill', 'none')
                    .attr('pointer-events', 'all')
                  .on('click', this.click);
    g           = svg.append('g').attr('id', 'temp');


    g.append('g')
        .attr('id', 'states')
        .attr('fill', '#aaa')
      .selectAll('path').data(topojson.feature(usamap, usamap.objects.states).features)
      .enter().append('path')
        .attr('d', path)
      .on('click', this.click);

    g.append('path')
      .datum(topojson.mesh(usamap, usamap.objects.states, (a, b) => {return (a !== b ); }))
        .attr('id', 'state-borders')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', '#fff')
        .attr('stroke-width', '1.5px')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('pointer-events', 'none');

    this.setState({
      projection: projection,
      path: path,
      g: g
    });


  }

  click(d) {
    var x, y, k;

    if (d && this.state.centered !== d) {
      this.setState({ centered: d });
      let centroid = this.state.path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 4;
    } else {
      this.setState({ centered: null });
      x = this.props.width/ 2;
      y = this.props.height / 2;
      k = 1;
      d3.select('#temp').selectAll('path')
        .classed('active', false);
    }

    this.state.g.selectAll('path')
      .classed('active', (this.state.centered) && (x => { return (x === this.state.centered); }));

    d3.selectAll('#states path').attr('fill', '#aaa');
    d3.select('.active').attr('fill', 'orange');

    d3.select('#temp').transition().duration(750)
      .attr('transform', 'translate(' + this.props.width / 2 + ',' + this.props.height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
      .style('stroke-width', 1.5 / k + 'px');

  }

  render() {
    return (
      <div>
        <svg
        width={this.props.width}
        height={this.props.height}
        className='zoomableMap'
        >
        </svg>
      </div>
    );
  }

}

ZoomableMap.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number
}

ZoomableMap.defaultProps = {
  width: 960,
  height: 500,
}

export default ZoomableMap;