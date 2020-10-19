import {Severity} from '../../constants/types';

export default interface ISnackbarProps {
    classes: any;
    open: boolean;
    severity: Severity;
    message: string;
    undo: boolean;
    closeSnackbar(): void;
}