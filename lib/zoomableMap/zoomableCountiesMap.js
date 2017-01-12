import React from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import usamap from './../assets/usamap.json';


class ZoomableCountiesMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      centered: null,
      path: null,
      projection: null,

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
    g           = svg.append('g').attr('id', 'whole-map');

    


    g.append('g')
      .attr('class', 'states')
      .attr('fill', '#aaa')
    .selectAll('path').data(topojson.feature(usamap, usamap.objects.states).features)
    .enter().append('path')
      .attr('d', path)
    .on('click', this.click);

    g.append('path')
      .datum(topojson.mesh(usamap, usamap.objects.states, (a, b) => {return (a !== b ); }))
        .attr('class', 'state-borders')
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

  click(d, i) {
    var x, y, k, path = this.state.path, usamap = this.state.usamap;

    if (d && this.state.centered !== d) {
      this.setState({ centered: d });
      let centroid = this.state.path.centroid(d);
      drawCounties();
      x = centroid[0];
      y = centroid[1];
      if (i === 4 || i === 43) {
        k = 2.5;
      } else {
        k = 4;
      }
    } else {
      this.setState({ centered: null });
      x = this.props.width/ 2;
      y = this.props.height / 2;
      k = 1;
      d3.selectAll('.county-borders').remove();
      d3.select('#whole-map').selectAll('path')
        .classed('active', false);
    }

    this.state.g.selectAll('path')
      .classed('active', (this.state.centered) && (x => { return (x === this.state.centered); }));

    d3.selectAll('.states path').attr('fill', '#aaa');
    d3.select('.active').attr('fill', 'orange');


    d3.select('#whole-map').transition().duration(750)
      .attr('transform', 'translate(' + this.props.width / 2 + ',' + this.props.height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
      .style('stroke-width', 1.5 / k + 'px');

    function drawCounties() {
      d3.select('#whole-map').append('path')
          .datum(topojson.mesh(usamap, usamap.objects.counties, (a, b) => {return (a !== b ); }))
            .attr('class', 'county-borders')
            .attr('d', path)
            .attr('fill', 'none')
            .attr('stroke', '#fff')
            .attr('stroke-width', '0.5px');    
    }
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

ZoomableCountiesMap.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number
}

ZoomableCountiesMap.defaultProps = {
  width: 960,
  height: 500,
}

export default ZoomableCountiesMap;