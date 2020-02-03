import React, { Component, Fragment } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import './SnackbarMessage.scss';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface ISnackbarProps {
    open: boolean;
    classes: any;
    closeSnackbar(event?: React.SyntheticEvent): void;
}

class SnackbarMessage extends Component<ISnackbarProps, any> {
    render() {
        const {classes, open} = this.props;
        
        return (        
            <Snackbar                                
                open={open}             
                onClose={this.props.closeSnackbar}             
                autoHideDuration={6000}>
                <Alert
                    onClose={this.props.closeSnackbar}
                    // action={ 
                    //     <Fragment>
                    //         <Button color="inherit" size="small">Undo</Button>
                    //         <IconButton
                    //             aria-label="close"
                    //             color="inherit"
                    //             size="small">
                    //             <CloseIcon fontSize="inherit" />
                    //         </IconButton>
                    //     </Fragment>                       
                    // }
                    className={classes.root} 
                    elevation={6}
                    variant="filled"
                    severity="success">
                    Recipe is saved!
                </Alert>
            </Snackbar>                         
        );
    }
}

export default withStyles(theme => ({
    root: {
        // background: '#093'
    }
  }))(SnackbarMessage);