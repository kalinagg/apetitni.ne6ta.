import React, {Fragment} from 'react';
import clsx from 'clsx';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {RootState, Severity} from '../../types';
import { closeSnackbar } from '../../actions';
import { connect } from 'react-redux';

interface ISnackbarProps {
    classes: any;
    open: boolean;
    severity: Severity;
    message: string;
    undo: boolean;
    close(): void;
}

const SnackbarMessage = (props: ISnackbarProps) => {    
    const {classes, open, severity, message, undo, close} = props;
    
    let undoButton;
    if(undo) {
        undoButton = <Button color="inherit" size="small">Undo</Button>;
    }

    return (        
        <Snackbar
            open={open}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            onClose={close}
            autoHideDuration={4000}>
            <Alert
                onClose={close}
                action={
                    <Fragment>
                        {undoButton}
                        <IconButton
                            onClick={close}
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

const SnackbarWithStyles = withStyles(theme => ({
    root: {
        borderRadius: '2px'
    }
}))(SnackbarMessage);

const mapStateToProps = (state: RootState) => {
    const {open, severity, message, undo} = state.snackbarState;

    return {
        open,
        severity,
        message,
        undo
    }
}

const mapDispatchToProps = dispatch => ({
    close: () => dispatch(closeSnackbar())
});

const ConnectedSnackbar = connect(mapStateToProps, mapDispatchToProps)(SnackbarWithStyles);

export default ConnectedSnackbar;