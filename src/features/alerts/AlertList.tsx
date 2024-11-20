import React from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {dismissAlert, selectAlerts} from "./index";
import ContextAlert from "./ContextAlert";

const AlertList = () => {
    const dispatch = useAppDispatch();
    const alerts = useSelector(selectAlerts);

    const dismissHandler = (key: string | number) => dispatch(dismissAlert(key));

    return (
        <div>
            {Object.keys(alerts).map(key => (
                <ContextAlert key={key} context={alerts[key].context} variant={alerts[key].color}
                              onClose={() => dismissHandler(key)} count={alerts[key].count}>
                    <div style={{whiteSpace: 'pre-wrap'}}>{alerts[key].error?.stack ?? alerts[key].error?.message}</div>
                </ContextAlert>
            ))}
        </div>
    )
}

export default AlertList;
