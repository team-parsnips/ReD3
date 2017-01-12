import React    from 'react';
import * as d3  from 'd3';

class SunBurst extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var width, height, radius, data, color, x, y, svg, partition, arc, root, g, path, text;

    width     = this.props.width;
    height    = this.props.height;
    data      = this.props.data;
    radius    = Math.min(width, height) / 2;
    color     = d3.scaleOrdinal(d3.schemeCategory20);

    x         = d3.scaleLinear()
                  .range([0, 2 * Math.PI]);

    y         = d3.scaleSqrt()
                  .range([0, radius]);

    svg       = d3.select(".sunburst").append("g")
                    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

    partition = d3.partition();

    arc       = d3.arc()
                  .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
                  .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
                  .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
                  .outerRadius(function(d) { return Math.max(0, y(d.y1)); });

    root      = d3.hierarchy(data);
    root.sum(function(d) { return d.size; });

    g         = svg.selectAll("g").data(partition(root).descendants())
                  .enter().append("g");

    path      = g.append("path")
                    .attr("d", arc)
                  .style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
                  .on("click", click);

    text      = g.append("text")
                    .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
                    .attr("x", function(d) { return y(d.y0); })
                    .attr("dx", "6") // margin
                    .attr("dy", ".35em") // vertical-align
                  .text(function(d) { return d.data.name; });

    function computeTextRotation(d) {
      var dx = d.x1 - d.x0;
      return (x(d.x0 + dx / 2) - Math.PI / 2) / Math.PI * 180;
    }

    function click(d) {
      // fade out all text elements
      text.transition().attr("opacity", 0);

      function arcTween(d) {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
        return function(d, i) {
          return i
              ? function(t) { return arc(d); }
              : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
        };
      }

      path.transition()
      .duration(750)
      .attrTween("d", arcTween(d))
      .on("end", function(e, i) {
          // check if the animated element's data e lies within the visible angle span given in d
          var dx = d.x1 - d.x0;
          if (e.x0 >= d.x0 && e.x0 < (d.x0 + dx)) {
            // get a selection of the associated text element
            var arcText = d3.select(this.parentNode).select("text");
            // fade in the text element and recalculate positions
            arcText.transition().duration(750)
              .attr("opacity", 1)
              .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
              .attr("x", function(d) { return y(d.y0); });
          }
      });
    }
  }
  render() {
    return (
      <svg
      width={this.props.width}
      height={this.props.height}
      className={'sunburst'} />
    );
  }
}

SunBurst.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  data: React.PropTypes.array.isRequired,
}

SunBurst.defaultProps = {
  width: 960,
  height: 700
}

export default SunBurst;