
$(document).ready(function() {
  // $('.flag').tooltip();
  $.ajax({
    url: 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json',
    dataType: 'json',
    error: (xhr,errorType) => {
     alert(errorType)
   },
   success: (data) => {
     const nodes = data['nodes']
     const links = data['links']
     var width = 1000, height = 800

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
        if (y < 5) {return 20}
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
          .attr('x1', function(d) {
            return keepInWidth(d.source.x)
          })
          .attr('y1', function(d) {
            return keepInHeight(d.source.y)
          })
          .attr('x2', function(d) {
            return keepInWidth(d.target.x)
          })
          .attr('y2', function(d) {
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
          .selectAll('foreignObject')
          .data(nodes)

          u.enter()
          .append('foreignObject')
          .merge(u)
          .attr('x', (d) => keepInWidth(d.x)-8)
          .attr('y', (d) => keepInHeight(d.y)-11)
          .attr('width',16)
          .attr('height',20)
          .append('xhtml:img')    
          .attr('src','blank.gif')
          .attr('title',(d) => d.country)
          .attr('data-toggle','tooltip')
          .attr('class', (d) => 'flag flag-'+d['code'])



          u.exit().remove()
        }

//highlight neighbours
function highlight() {
  var u = d3.select('.nodes')
  u.selectAll('foreignObject')
  .data(nodes)
  .on('mouseover',(d,i) => {
   var neighbours = findNeighbour(i);
   for (var j=0;j<neighbours.length;j++) {
    $('.flag-'+neighbours[j]).addClass('highlight')       
  }
})
  .on('mouseout',(d,i) => {
    var neighbours = findNeighbour(i);
    for (var j=0;j<neighbours.length;j++) {
      $('.flag-'+neighbours[j]).removeClass('highlight')
    }
  })
}

function ticked() {
  updateLinks()
  updateNodes()
  highlight()
}
}                                  
});
})