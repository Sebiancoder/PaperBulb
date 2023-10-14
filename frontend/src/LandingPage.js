import React, { useState } from 'react';
import Search from './Search';

const LandingPage = ({ handleEnterSite }) => {
    const [papers, setPapers] = useState([]);

    return (
        <div>
            <Search setPapers={setPapers} />
            <div className="papers-grid">
                {papers.map((paper, index) => (
                    <div key={index} className="paper">
                        <h2>{paper.title}</h2>
                        <p>{paper.abstract}</p>
                    </div>
                ))}
            </div>
            <button onClick={handleEnterSite}>Enter</button>
        </div>
    );
};

export default LandingPage;
