/**
 * Basic imports/reqs.
 */
const { useState } = wp.element;
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

/**
 * Material UI imports
 */
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import CheckIcon from '@material-ui/icons/Check';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert, AlertTitle } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

/**
 * Custom components
 */
import QreuzAjax from './../../components/qreuz-ajax';

/**
 * Define local styles.
 */
const useStyles = makeStyles((theme) => ({
	isHidden: {
		display: 'none',
		visibility: 'hidden',
	},
	wrapper: {
		margin: theme.spacing(1),
		position: 'relative',
		textAlign: 'center',
		maxWidth: 'fit-content',
	},
	qreuzFormLegalinfo: {
		fontSize: '80%',
		margin: '.5em 0',
	},
	qreuzFormField: {
		display: 'block',
	},
	formAdornment: {
		color: theme.palette.primary.main,
	},
	heading: {
		textAlign: 'left',
		marginBottom: '1em',
	},
	bold: {
		fontWeight: 'bold',
		textAlign: 'left',
	},
	qreuzLogin: {
		textAlign: 'left',
		marginTop: '1em',
	},
}));

/**
 * Yup validation schemas.
 */
const validationSchemaGetstarted = yup.object().shape({
	user_email: yup.string()
		.email('Please enter a valid email address')
		.required('Email is required')
});

/**
 * Load admin page content for: Getstarted
 * 
 * @props
 */
export default function AdminPageGetstarted(props) {

	/**
	 * react-hook-form
	 * */
	const { handleSubmit, register, reset, errors } = useForm({
		resolver: yupResolver(validationSchemaGetstarted)
	});

	/**
	 * Local state.
	 * */
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [open, setOpen] = useState(false);
	const [snackbar, setSnackbar] = useState({
		variant: '',
		message: '',
		title: '',
		linksTitle: '',
		linkTroubleshooting: 'https://qreuz.com/documentation/troubleshooting/getstarted',
		linkTextTroubleshooting: '➜ Troubleshooting.',
		linkLogin: 'admin.php?page=qreuz&subpage=login',
		linkTextLogin: '➜ Log in to your existing account.',
	});

	/**
	 * Load local styles
	 */
	const classes = useStyles();

	/**
	 * Consts
	 * */
	const timer = React.useRef();

	const formAdornment = clsx({
		[classes.isHidden]: !success,
		[classes.formAdornment]: true,
	});
	
	/**
	 * Handlers
	 * */
	const handleOpen = () => {
		setOpen(true);
	};
	
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		  }
		setOpen(false);
	};

	const handleSuccess = (msg) => {
		setLoading(false);
		setDisabled(true);
		setSuccess(true);
		setSnackbar({
			...snackbar,
			variant: 'success',
			message: 'Check your mail now.\u000AWe\'ve just sent you the link to activate your account.',
			title: 'Sweet! Request successful.',
			linksTitle: 'No Email received?',
		});
		handleOpen();
	}

	const handleError = (msg) => {
		setLoading(false);
		setDisabled(false);
		setSnackbar({
			...snackbar,
			variant: 'error',
			message: 'An error occured. Please try again.',
			title: 'Error',
			linksTitle: 'Looking for something else?',
		});
		handleOpen();
	}

	/**
	 * Form submit
	 * */
	const onSubmit = (data) => {

		if (!loading) {
			setSuccess(false);
			setLoading(true);
			setDisabled(true);
		}

		const pushParams = {
			user_email: data.user_email
		}

		const pushData = async () => {
            try {
                const response = await QreuzAjax('qreuz_getstarted','getstarted', props, pushParams);

				if ( true == response.success ) {
					handleSuccess(response.msg);
				} else {
					handleError(response.msg);
				}

            } catch (e) {
                console.log(e);
            }
		}
		pushData();
	}

	/** 
	 * Initial load effect.
	 * */
	React.useEffect(() => {
		document.title = "Get started - Qreuz";
		return () => {
			clearTimeout(timer.current);
		};
	}, []);

	return (
		<Grid container>
			<Grid item xs={12} sm={12} md={12}>
					<Typography variant="h2" gutterBottom>
						Welcome to Qreuz
					</Typography>
					<Typography variant="body1" gutterBottom>
						Get started now!
					</Typography>
				</Grid>
			<Grid item xs={12}>
				<Card>
					<CardContent>
						<form
							id="qreuz_admin_form_getstarted"
							onSubmit={handleSubmit(onSubmit)}
							noValidate
							autoComplete="off"
							>
							<Typography component="h4" className={classes.heading + ' ' + classes.bold}>
								Enter your email and connect your website with Qreuz
							</Typography>
							<TextField
								inputRef={register({required:true})}
								name="user_email"
								id="user_email"
								type="text"
								label="Email"
								error={errors.user_email}
								disabled={disabled}
								defaultValue=""
								helperText={errors.user_email ? errors.user_email.message : ' '}
								InputProps={{
									endAdornment: (
									<InputAdornment position="end" className={formAdornment}>
										<CheckIcon />
									</InputAdornment>
									),
								}}
								/>
							<p className={classes.qreuzFormLegalinfo}>By entering your email address and clicking "get started", you give us permission to send you an email with the link to activate your new Qreuz account. Find more information in our <a href="https://qreuz.com/privacy" target="_blank">privacy policy</a>.</p>
							<div className={classes.wrapper}>
								<Button
									variant="contained"
									type="submit"
									color="primary"
									disabled={disabled}
									size="large"
									>
									Get started
									{loading && <CircularProgress size={24} />}
								</Button>
							</div>
							<p className={classes.qreuzLogin}>Already have an account? <Link to="admin.php?page=qreuz&subpage=login">Log in here</Link></p>
						</form>
					</CardContent>
				</Card>
				
					
				
				
				<Snackbar
					open={open}
					autoHideDuration={18000}
					onClose={handleClose}
					>
					<Alert
						onClose={handleClose}
						severity={snackbar.variant}
						elevation={6}
						variant="filled"
						{...props}
						>
						<AlertTitle>{snackbar.title}</AlertTitle>
						<p>{snackbar.message}</p>
						<u>{snackbar.linksTitle}</u>
						<a href={snackbar.linkTroubleshooting}>{snackbar.linkTextTroubleshooting}</a>
						<a href={snackbar.linkLogin}>{snackbar.linkTextLogin}</a>
					</Alert>
				</Snackbar>
			</Grid>
		</Grid>		
	);
}
