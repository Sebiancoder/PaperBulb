import React, { useState } from 'react';
import { Form, FormControl, Button, Spinner } from 'react-bootstrap';
import sendBackendRequest from './sendBackendRequest.js';

function Search({ setPapers, setIsLandingPage }) {
    const [searchText, setSearchText] = useState('CNN');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        console.log(`Searching for ${searchText}...`);
    
        try {
            const params = new URLSearchParams({ query: searchText });
            console.log("params:", params.toString());
            const papersResponse = await sendBackendRequest("search_papers", params.toString()); 
            if (typeof setIsLandingPage === "function") {
                setIsLandingPage(true);
            }
            if (papersResponse) {
                setPapers(papersResponse); 
            }
        } catch (error) {
            console.error("Error fetching papers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form inline onSubmit={handleSearch} className="search-form">
            <div className="input-group">
                <FormControl
                    type="text"
                    placeholder="Search"
                    className="mr-sm-2 search-input"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    disabled={isLoading}
                />
                <Button variant="outline-success" type="submit" className="search-button" disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : 'Search'}
                </Button>
            </div>
        </Form>
    );
}

export default Search;
