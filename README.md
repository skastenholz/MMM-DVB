# MMM-DVB  [![Build](https://travis-ci.org/skastenholz/MMM-DVB.svg)](https://travis-ci.org/skastenholz/MMM-DVB)
<B>Station monitor</B> for the <B>Dresden local transport (DVB)</B> bus, tram and train system.<P>

This module is an extension of the [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) project by [MichMich](https://github.com/MichMich/).

![English version](screenshot_en.png)

## Installation
1. Navigate into your MagicMirror's `modules` folder.
2. Execute `git clone https://github.com/skastenholz/MMM-DVB.git`.
3. Execute `cd MMM-DVB`.
3. Execute `npm install`.

## Configuration
Sample minimum configuration entry for your `~/MagicMirror/config/config.js`:

    ...
    
    {
        module: 'MMM-DVB',
        position: 'top_left',
        config: {
			stopName: 'Hauptbahnhof',		// Which stop would you like to have displayed?			
        }
    }
    
    ...

Sample configuration entry for your `~/MagicMirror/config/config.js` with optional parameters:

    ...
    
    {
        module: 'MMM-DVB',
        position: 'top_left',
        config: {
          stopName: 'Hauptbahnhof', // Which stop would you like to have displayed?
          timeOffset: 5,  // With how many minutes in advance should connections be displayed?
          resultNum: 5, // How many connections should be displayed?
          reload: 60000 // How often should the information be updated? (In milliseconds)
        }
    }
    
    ...

## Dependencies
  * npm
  * [dvbjs](https://www.npmjs.com/package/dvbjs)
  
## Acknowledgements
  * [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
  * [MMM-KVV](https://github.com/yo-less/MMM-KVV)
