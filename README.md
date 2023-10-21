# InfoInsight: Navigate News with Confidence - by Ishraq Mahid and Miles Acquaviva

## Overview
This project was mainly inspired by divisive current events. In a day an age where information comes and goes, and credibility is constantly questioned, we developed an app extension to aid readers in making informed decisions of texts before they read it. We provide an interface integrated into the browsing experience, in order to give an overview of news sites a user may click on, providing the source's bias, reliability, and a brief analysis/description.

## Sources
This draws information from mediabiasfactcheck.com, and uses their analysis for the formation of source accuracy and bias, along with the analysis/description portion.

We also use the following to sample relevant sources: "Clemm von Hohenberg, B., Menchen-Trevino, E., Casas, A., Wojcieszak, M. (2021). A list of over 5000 US news domains and
      their social media accounts. https://doi.org/10.5281/zenodo.7651047"

## Implementations
The 'dataset_creation' portion of the project focuses on the webscraping of data from mediabiasfactcheck.com, in combination with the list of US news domains, in order to create an aggregate JSON file that contains the information we need for quick information retrieval. This information is then stored within the extension, which scans the current page for links. If the extension finds a match with a link, it inserts the desired resources to display to the user.