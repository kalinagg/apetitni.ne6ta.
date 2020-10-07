import React, {Component, Fragment} from 'react';
import clsx from 'clsx';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ISnackbarProps from './ISnackbarProps';

export type Severity = 'success' | 'info' | 'warning' | 'error';

export enum SnackbarSeverity {
    Success = 'success',
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
}

class SnackbarMessage extends Component<ISnackbarProps, any> {
    render() {
        const {classes, open, severity, message, undo, closeSnackbar} = this.props;
        
        let undoButton;
        if(undo) {
            undoButton = <Button color="inherit" size="small">Undo</Button>;
        }

        return (        
            <Snackbar
                open={open}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                onClose={closeSnackbar}
                autoHideDuration={6000}>
                <Alert
                    onClose={closeSnackbar}
                    action={
                        <Fragment>
                            {undoButton}
                            <IconButton
                                onClick={closeSnackbar}
                                aria-label="close"
                                color="inherit"
                                size="small">
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        </Fragment>                       
                    }
                    className={clsx(classes.root)} 
                    elevation={6}
                    variant="filled"
                    severity={severity}>
                    {message}
                </Alert>
            </Snackbar>                         
        );
    }
}

export default withStyles(theme => ({
    root: {
        borderRadius: '2px'
    }
  }))(SnackbarMessage);