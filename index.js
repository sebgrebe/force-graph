$(document).ready(function() {
   $.ajax({
    url: 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json',
    dataType: 'json',
    error: (xhr,errorType) => {
     alert(errorType)
   },
   success: (data) => {
     const nodes = data['nodes']
     const links = data['links']
     var width = 1000 
     var height = 800

     var simulation = d3.forceSimulation(nodes)
     .force('charge', d3.forceManyBody().strength(-10))
     .force('center', d3.forceCenter(width / 2, height / 2))
     .force('link', d3.forceLink().links(links).distance(50))
     .on('tick', ticked);

     function keepInWidth(x) {
      if (x < 0) {return 20}
        else if (x > width) {return width-20}
          else {return x}
        }

      function keepInHeight(y) {
        if (y < 10) {return 20}
          else if (y > height) {return height - 20}
            else {return y}
          }  

      function updateLinks() {
        var u = d3.select('.links')
                  .selectAll('line')
                  .data(links)

        u.enter()
          .append('line')
          .merge(u)
          .attr('x1', (d) => {
            return keepInWidth(d.source.x)
          })
          .attr('y1', (d) => {
            return keepInHeight(d.source.y)
          })
          .attr('x2', (d) => {
            return keepInWidth(d.target.x)
          })
          .attr('y2', (d) => {
            return keepInHeight(d.target.y)
          })
          u.exit().remove()
      }

      function findNeighbour(index) {
        var neighbours = [];
        for (var i=0;i<links.length;i++) {
          var source_index = links[i]['source']['index'];
          var target_index = links[i]['target']['index'];
          if (source_index === index) {
            neighbours.push(nodes[target_index]['code']);
          }
          else if (target_index === index) {
            neighbours.push(nodes[source_index]['code'])
          }
        }
        return neighbours
      }

      function updateNodes() {
        var u = d3.select('.nodes')
        .selectAll('image')
        .data(nodes)

        u.enter()
          .append('svg:image')
          .merge(u)
          .attr('x', (d) => keepInWidth(d.x)-8)
          .attr('y', (d) => keepInHeight(d.y)-11)
          .attr('width',20)
          .attr('height',14)
          .attr('xlink:href', (d) => 'flags/'+d['code']+'.png')
          .exit().remove()
      }

        function updateRect() {
        var u = d3.select('.nodes')
                  .selectAll('rect')
                  .data(nodes)
              
                 u.enter()
                  .append('svg:rect')
                  .merge(u)
                  .attr('x', (d) => keepInWidth(d.x)-8)
                  .attr('y', (d) => keepInHeight(d.y)-11)
                  .attr('width',20)
                  .attr('height',14)
                  .attr('stroke','none')
                  .attr('stroke-width',2)
                  .attr('fill','none')
                  .attr('class',(d) => d['code'])
                  .exit().remove()
          }

        //highlight neighbours and show tooltip
        function highlight() {
          var u = d3.select('.nodes')
          u.selectAll('image')
            .data(nodes)
            .on('mouseover',(d,i) => {
              u.append('title')
                .attr('x', keepInWidth(d.x)+10)
                .attr('y', keepInHeight(d.y)-11)
                .attr('width',80)
                .attr('height',40)
                .text(d['country'])

              var neighbours = findNeighbour(i);
              for (var j=0;j<neighbours.length;j++) {
                $('.'+neighbours[j]).addClass('highlight')       
              }
            })
            .on('mouseout',(d,i) => {
              var u = d3.select('.nodes')
              u.selectAll('title').remove()
              var neighbours = findNeighbour(i);
              for (var j=0;j<neighbours.length;j++) {
                $('.'+neighbours[j]).removeClass('highlight')
              }
            })
          }

        function ticked() {
          updateLinks()
          updateNodes()
          updateRect()
          highlight()
        }
      }                                  
    });
})