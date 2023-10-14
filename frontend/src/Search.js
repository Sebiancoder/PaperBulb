import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import sendBackendRequest from './sendBackendRequest.js';

function Search({ setPapers }) {
    const [searchText, setSearchText] = useState('CNN');

    const handleSearch = async (event) => {
        event.preventDefault();
        console.log(`Searching for ${searchText}...`);

        try {
            const params = new URLSearchParams({ query: searchText });
            console.log("params:", params.toString());
            const papersResponse = await sendBackendRequest("search_papers", params.toString());
            setPapers(papersResponse);
        } catch (error) {
            console.error("Error fetching papers:", error);
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
                />
                <Button variant="outline-success" type="submit" className="search-button">Search</Button>
            </div>
        </Form>
    );
}

export default Search;
