import React from 'react';
import {AlertList} from "chums-connected-components";
import DropTarget from "../components/DropTarget";
import FileList from "../components/FileList";
import Preview from "../components/Preview";
import {ErrorBoundary} from "chums-components";

const App = () => {
    return (
        <div className="container-fluid">
            <AlertList />
            <div className="row g-3">
                <div className="col-md-4">
                    <h3>Upload</h3>
                    <DropTarget />
                    <ErrorBoundary>
                        <FileList />
                    </ErrorBoundary>
                </div>
                <div className="col-md-8">
                    <h3>Preview</h3>
                    <ErrorBoundary>
                        <Preview />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    )
}

export default App;
