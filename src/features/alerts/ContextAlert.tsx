import React from 'react'
import {AlertProps, Badge} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

export interface ContextAlertProps extends AlertProps {
    count: number;
    context?: string;
    children: React.ReactNode;
}
export default function ContextAlert({count, context, children, ...alertProps}:ContextAlertProps) {
    return (
        <Alert {...alertProps}>
            {!!context && (
                <Alert.Heading>[{context}]</Alert.Heading>
            )}
            {children}
            {count > 1 && <Badge>{count}</Badge>}
        </Alert>
    )
}
