import React, {Fragment} from 'react';
import clsx from 'clsx';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {Severity} from '../../constants/types';

interface ISnackbarProps {
    classes: any;
    open: boolean;
    severity: Severity;
    message: string;
    undo: boolean;
    closeSnackbar(): void;
}

const SnackbarMessage = (props: ISnackbarProps) => {    
    const {classes, open, severity, message, undo, closeSnackbar} = props;
    
    let undoButton;
    if(undo) {
        undoButton = <Button color="inherit" size="small">Undo</Button>;
    }

    return (        
        <Snackbar
            open={open}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            onClose={closeSnackbar}
            autoHideDuration={4000}>
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

export default withStyles(theme => ({
    root: {
        borderRadius: '2px'
    }
  }))(SnackbarMessage);