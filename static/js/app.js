// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.find(meta => meta.id == sample);
    
    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    panel.html("");
    
    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata
    Object.entries(result).forEach(([key, value]) => panel.append("h6").text(`${key.toUpperCase()}: ${value}`));
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    // function returns the sample ID that equals the sample number
    function filterSamples(sampleNumber) {
      return function(sample) {
        return sample.id == sampleNumber;
      };
    }
    
    // Call the custom function with filter()
    let filteredSamples = samples.filter(filterSamples(sample));
    // Get the first element of the filtered array
    const result = filteredSamples[0];


    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    const Trace_bubble = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };
    const Layout_bubble = {
      title: 'OTU ID vs. Sample Values',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' },
      hovermode: 'closest'
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', [Trace_bubble], Layout_bubble);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // Build and render the Bar Chart
    const Trace_bar = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };
    const Layout_bar = {
      title: 'Top 10 OTUs Found',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [Trace_bar], Layout_bar);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sample_names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sample_names.forEach(sample => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const first_sample = sample_names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(first_sample);
    buildMetadata(first_sample);
  });
}

// Function for event listener
function new_option(new_sample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(new_sample);
  buildMetadata(new_sample);
}

// Initialize the dashboard
init();
