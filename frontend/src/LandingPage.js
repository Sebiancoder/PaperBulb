import React, { useState } from 'react';
import Search from './Search';

const LandingPage = ({ handleEnterSite }) => {
    const [papers, setPapers] = useState({});

    return (
        <div>
            <Search setPapers={setPapers} />
            <div className="papers-grid">
                {Object.entries(papers).map(([paperId, paperMetadata], index) => (
                    <div key={paperId} className="paper" onClick={() => handleEnterSite(paperId)}>
                        <h2>{paperMetadata.title}</h2>
                        <p>{paperMetadata.authors[0]["name"]}</p>
                    </div>
                ))}
            </div>
            <button onClick={handleEnterSite}>Enter</button>
        </div>
    );
};

export default LandingPage;
