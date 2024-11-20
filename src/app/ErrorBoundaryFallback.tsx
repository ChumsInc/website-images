import React from 'react';
import Alert from "react-bootstrap/Alert";
import {SerializedError} from "@reduxjs/toolkit";

export default function ErrorBoundaryFallback({error, resetErrorBoundary}:{
    error: Error|SerializedError;
    resetErrorBoundary: () => void;
}) {
    return (
        <Alert variant="danger">
            <Alert.Heading>Yikes!</Alert.Heading>
            {error.message}
        </Alert>
    )
}
