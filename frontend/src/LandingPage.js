import React from 'react';
import Search from './Search';
import './LandingPage.css';

const LandingPage = ({ handleEnterSite, papers, setPapers }) => {
    console.log("LandingPage's papers:", papers);

    return (
      <div>
        <div className='search-container'>
          <Search setPapers={setPapers} />
        </div>
        <div className="papers-grid">
          {Object.entries(papers).map(([paperId, paperMetadata], index) => (
            <div key={paperId} className="paper" onClick={() => handleEnterSite(paperId)}>
              <h2>{paperMetadata.title}</h2>
              <p>{paperMetadata.authors[0]["name"]}</p>
            </div>
          ))}
        </div>
      </div>
    );
};

export default LandingPage;
