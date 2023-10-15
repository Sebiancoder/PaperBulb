import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import './FilterMenu.css';

function FilterMenu(props) {
    const [refDlim, setRefDlim] = useState(1);
    const [cbDlim, setCbDlim] = useState(1);
    const [minYear, setMinYear] = useState(1950);
    const [minNumCitations, setMinNumCitations] = useState(500);
    const [nLeastReferences, setNLeastReferences] = useState(10);

    const handleRefDlimChange = (event, newValue) => {
        setRefDlim(newValue);
    };

    const handleCbDlimChange = (event, newValue) => {
        setCbDlim(newValue);
    };

    const handleMinYearChange = (event, newValue) => {
        setMinYear(newValue);
    };

    const handleMinNumCitationsChange = (event, newValue) => {
        setMinNumCitations(newValue);
    };

    const handleNLeastReferencesChange = (event, newValue) => {
        setNLeastReferences(newValue);
    };

    return (
        <div className='slider-container'>
            <Typography id="ref-dlim-slider" gutterBottom>
                Ref Dlim
            </Typography>
            <Slider
                value={refDlim}
                onChange={handleRefDlimChange}
                aria-labelledby="ref-dlim-slider"
                step={1}
                min={0}
                max={10}
                valueLabelDisplay="auto"
            />
            <Typography id="cb-dlim-slider" gutterBottom>
                Cb Dlim
            </Typography>
            <Slider
                value={cbDlim}
                onChange={handleCbDlimChange}
                aria-labelledby="cb-dlim-slider"
                step={1}
                min={0}
                max={10}
                valueLabelDisplay="auto"
            />
            <Typography id="min-year-slider" gutterBottom>
                Min Year
            </Typography>
            <Slider
                value={minYear}
                onChange={handleMinYearChange}
                aria-labelledby="min-year-slider"
                step={1}
                min={1900}
                max={2022}
                valueLabelDisplay="auto"
            />
            <Typography id="min-num-citations-slider" gutterBottom>
                Min Num Citations
            </Typography>
            <Slider
                value={minNumCitations}
                onChange={handleMinNumCitationsChange}
                aria-labelledby="min-num-citations-slider"
                step={10}
                min={0}
                max={1000}
                valueLabelDisplay="auto"
            />
            <Typography id="n-least-references-slider" gutterBottom>
                N Least References
            </Typography>
            <Slider
                value={nLeastReferences}
                onChange={handleNLeastReferencesChange}
                aria-labelledby="n-least-references-slider"
                step={1}
                min={0}
                max={50}
                valueLabelDisplay="auto"
            />
        </div>
    );
}

export default FilterMenu;
