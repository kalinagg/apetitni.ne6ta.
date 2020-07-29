import {Severity} from './SnackbarMessage';

export default interface ISnackbarProps {
    classes: any;
    open: boolean;
    severity: Severity;
    message: string;
    undo: boolean;
    closeSnackbar(): void;
}