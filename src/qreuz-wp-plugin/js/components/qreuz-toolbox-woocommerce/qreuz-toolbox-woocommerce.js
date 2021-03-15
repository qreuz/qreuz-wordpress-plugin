/**
 * Basic imports/reqs.
 * */
const { useState } = wp.element;
import { BrowserRouter as Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

/**
 * Material UI imports
 * */
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert, AlertTitle } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';

/**
 * Import custom components.
 * */
import QreuzAjax from './../../components/qreuz-ajax';
import { GenericContext, LocalContext } from './../../components/qreuz-state-provider/context';

/**
 * Define local styles.
 */
const useStyles = makeStyles({
  });

/**
 * Yup validation schema
 * */
const validationSchema = yup.object().shape({
	});

export default function QreuzToolboxWoocommerce(props) {

	/**
	 * react-hook-form
	 * */
	const { handleSubmit, register, reset, errors } = useForm({
		resolver: yupResolver(validationSchema)
	});

	/**
	 * Load context.
	 * */
	const { message } = React.useContext(
		GenericContext
	);
	const {} = React.useContext(
		LocalContext
	);

	/**
	 * Local state.
	 */
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [open, setOpen] = useState(false);
	const [snackbar, setSnackbar] = useState({
		variant: '',
		message: '',
		title: '',
		link01: '',
		linkText01: '',
		link02: '',
		linkText02: ''
	});


	/**
	 * Load local styles.
	 */
	const classes = useStyles();

	/**
	 * Consts
	 * */
	const timer = React.useRef();

	/**
	 * Handlers.
	 */
	const handleSuccess = (msg) => {
		setLoading(false);
		setSuccess(true);
		setSnackbar({
			...snackbar,
			variant: 'success',
			message: 'Completed.\u000A',
			title: 'Success.',
		});
		setOpen(true);
	}

	const handleError = (msg) => {
		setLoading(false);
		setSnackbar({
			...snackbar,
			variant: 'error',
			message: 'An error occured. Please try again.',
			title: 'Error',
		});
		setOpen(true);
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	}

	/**
	 * Form submit
	 * */
	const onSubmit = (data) => {

		if (!loading) {
			setSuccess(false);
			setLoading(true);
		}

		const pushParams = {
			
		}

		const pushData = async () => {
            try {
                const response = await QreuzAjax('qreuz_toolbox_woocommerce', 'woocommerce_sync_customer_orders', props, pushParams);

				if ( !response.hasOwnProperty("error") ) {
					handleSuccess(response.message);
				} else {
					handleError(response.message);
				}

            } catch (e) {
                console.log(e);
            }
		}
		pushData();
	}


	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {

	}, []);

	return (
		<React.Fragment>
			<form
				id="qreuz_toolbox_woocommerce"
				onSubmit={handleSubmit(onSubmit)}
				className={classes.form}
				noValidate
				autoComplete="off"
				>
				<Button
					variant="contained"
					type="submit"
					disabled={loading}
					size="large"
					>
					Synchronize order/customer
					{loading && <CircularProgress size={24} />}
				</Button>
			</form>
			<Snackbar open={open} autoHideDuration={18000} onClose={handleClose}>
					<Alert onClose={handleClose} severity={snackbar.variant} elevation={6} variant="filled" {...props}>
						<AlertTitle>{snackbar.title}</AlertTitle>
						{snackbar.message}
						<Link to={snackbar.link01}>{snackbar.linkText01}</Link>
						<Link to={snackbar.link02}>{snackbar.linkText02}</Link>
					</Alert>
				</Snackbar>

		</React.Fragment>
		
	)
}
