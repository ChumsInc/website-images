import React from 'react';

import DropTarget from "../components/DropTarget";
import FileList from "../components/FileList";
import Preview from "../components/Preview";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallback from "./ErrorBoundaryFallback";
import AlertList from "../features/alerts/AlertList";
import {Col, Container, Row} from "react-bootstrap";

const App = () => {
    return (
        <Container fluid>
            <AlertList/>
            <Row className="g-3">
                <Col md={4}>
                    <h3>Upload</h3>
                    <DropTarget/>
                    <ErrorBoundary fallback={undefined} FallbackComponent={ErrorBoundaryFallback}>
                        <FileList/>
                    </ErrorBoundary>
                </Col>
                <Col md={8}>
                    <h3>Preview</h3>
                    <ErrorBoundary fallback={undefined} FallbackComponent={ErrorBoundaryFallback}>
                        <Preview/>
                    </ErrorBoundary>
                </Col>
            </Row>
        </Container>
    )
}

export default App;
