import React from 'react';
import * as d3 from 'd3';


class Voronoi extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      voronoi: null,
      polygon: null,
      link: null,
      site: null,
      options: {
        'polyFill': this.props.polyFill || 'none',

      }
    }
    this.redraw = this.redraw.bind(this);
    this.moved = this.moved.bind(this);
  }

  componentDidMount() {
    var svg, voronoi, polygon, link, site, yo;

    svg     = d3.select('.voronoi');
    voronoi = d3.voronoi().extent([[-1, -1], [960 + 1, 500 + 1]]);
    polygon = svg.append('g')
                .attr('class', 'polygon')
              .selectAll('path').data(voronoi.polygons(this.props.data))
              .enter().append('path')
                .attr('fill', 'none')
                .attr('stroke', '#000')
              .call(this.redrawPolygon);
    link    = svg.append('g')
                .attr('class', 'links')
              .selectAll('line').data(voronoi.links(this.props.data))
              .enter().append('line')
                .attr('stroke', '#000')
                .attr('stroke-opacity', '0.2') 
              .call(this.redrawLink);
    site    = svg.append('g')
                .attr('class', 'sites')
              .selectAll('circle').data(this.props.data)
              .enter().append('circle')
                .attr('r', 2.5)
                .attr('fill', '#000')
                .attr('stroke', '#fff')
              .call(this.redrawSite);
    
    this.setState({
      voronoi: voronoi,
      polygon: polygon,
      link: link,
      site: site
    });


  }

  moved(e) {
    let temp = this.props.data;
    temp[0] = [e.clientX, e.clientY];
    this.setState({dataSet: temp});
    this.redraw();
    d3.select('.voronoi').select('.polygon').select('path').attr('fill', '#f00');
    d3.select('.voronoi').select('.sites').select('circle').attr('fill', '#fff');

  }

  redraw() {
    let diagram = this.state.voronoi(this.props.data);
    this.setState({polygon: this.state.polygon.data(diagram.polygons()).call(this.redrawPolygon)});
    this.setState({link: this.state.link.data(diagram.links())});
    this.setState({link: this.state.link.exit().remove()});
    this.setState({link: this.state.link.enter().append('line').merge(this.state.link).call(this.redrawLink)});
    this.setState({site: this.state.site.data(this.props.data).call(this.redrawSite)});
  }

  redrawPolygon(polygon) {
    polygon.attr('d', d => { return (d ? "M" + d.join("L") + "Z" : null); });
  }

  redrawLink(link) {
    link.attr('x1', d => d.source[0])
        .attr('y1', d => d.source[1])
        .attr('x2', d => d.target[0])
        .attr('y2', d => d.target[1]);
  }

  redrawSite(site) {
    site.attr('cx', d => d[0])
        .attr('cy', d => d[1]);
  }


  render() {
    return (
      <div>
        <svg
        width={this.props.width}
        height={this.props.height}
        className='voronoi'
        onMouseMove={this.moved}>
        </svg>
      </div>
    );
  }

}

Voronoi.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number
}

Voronoi.defaultProps = {
  width: 960,
  height: 500,
};

export default Voronoi;