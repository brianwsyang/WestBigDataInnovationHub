// var dataset = [{
  
// }];

var data = {
  // packageNames: ['Metro Data Science', 'Natural Resources & Hazards', 'Health', 'Data-Enabled Discovery & Learning', 'Data Storytelling',
  //                'Transportation & Driver Video Privacy Challenge', 'DSSG Projects', 'Border Solutions Alliance Challenge',
  //                'Open Water Data: Team Projs, Consortium National Academies', 'Natural Resources Workshops', 'Climate Indicators',
  //                'WiDS Datathon 2020, 2021', 'COVID-19 Efforts',
  //                "Let's Make It COUNT (Census)", 'National Data Sci Education Workshop', 'HSI STEM Workshop', 'Data Carpentry Training'

  //                 ],
  packageNames: ['Metro Data Science', 'Natural Resources & Hazards', 'Health', 'Data-Enabled Discovery', 'Data Storytelling',
                 'Driver Video Privacy Challenge', 'DSSG Projects', 'Border Solutions Alliance Challenge',
                 'Open Water Data Challenge', 'Natural Resources Workshops', 'Climate Indicators',
                 'WiDS Datathon 2020, 2021', 'COVID-19 Efforts',
                 "Let's Make It COUNT (Census)", 'National Data Sci Edu Workshop', 'HSI STEM Workshop', 'Data Carpentry Training'
 
                   ],
  matrix: [
           // thematic areas
           [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
           // data storytelling
           [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
           //metro data science
           [4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           // natural resources & hazards
           [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           // health
           [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           // data-enabled discovery & learning
           [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          ]
};

var chart = d3.chart.dependencyWheel()
                    .margin(50)
                    .padding(0.025);

d3.select('#dw_placeholder')
  .datum(data)
  .call(chart);