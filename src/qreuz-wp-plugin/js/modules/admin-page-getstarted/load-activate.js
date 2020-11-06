/**
 * Basic imports/reqs.
 */
const { useState } = wp.element;
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";

/**
 * Material UI imports
 */
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert, AlertTitle } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';

/**
 * Custom components
 */
import QreuzAjax from '../../components/qreuz-ajax';
import { GenericContext } from '../../components/qreuz-state-provider/context';

/**
 * Define local styles.
 */
const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',		
		alignItems: 'left',
		textAlign: 'left',
	},
	isHidden: {
		display: 'none',
		visibility: 'hidden',
	},
	form: {
		maxWidth: '500px',
		display: 'inline-block',
		alignItems: 'left',
		backgroundColor:'#ffffff',
		padding: '2em',
	  '& > *': {
		display: 'block',
	  },
	},
	wrapper: {
		textAlign: 'left',
	  },
	qreuzFormLegalinfo: {
		fontSize: '90%',
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
	},
	arrowIcon: {
		display: 'block',
		width: '100%',
		height: '3em',
		color: '#14b084',
		marginBottom: '1em',
	},
	username: {
		fontSize: '1.3em',
		textAlign: 'left',
	}
}));

/**
 * Yup validation schemas.
 */
const validationSchemaActivate = yup.object().shape({
	user_password: yup.string()
		.required('Password is required.')
		.min(8, '8 characters minimum.')
		.max(86, 'Enough is enough: 86 characters maximum.')
		.matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])+/, 'At least one of each: CAPITAL LETTERS, small letters, numbers.'),
	user_password_verify: yup.string()
		.oneOf([yup.ref('user_password'), null], 'Passwords don\'t match.'),
});

/**
 * Admin page content for: activate user account
 * 
 * @props
 */
export default function LoadActivate(props) {

	/**
	 * react-hook-form
	 * */
	const { handleSubmit, register, reset, errors } = useForm({
		resolver: yupResolver(validationSchemaActivate)
	});

	/**
	 * Load context.
	 * */
	const { userEmail, authParam, setJustLoggedIn } = React.useContext(
		GenericContext
	);

	/** 
	 * Local state.
	 * */
	const [loading, setLoading] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const timer = React.useRef();
	const [open, setOpen] = useState(false);
	const [snackbar, setSnackbar] = useState({
		variant: '',
		message: '',
		title: '',
		link01: '',
		linkText01: '',
		link02: '',
		linkText02: '',
	});

	/** 
	 * Consts
	 * */
	const classes = useStyles();

	/**
	 * Handlers
	 * */
	const handleSuccess = (msg) => {
		setLoading(true);
		setSuccess(true);
		setSnackbar({ 
			...snackbar,
			variant: 'success',
			message: msg,
			title: 'Success',
			link01: '',
			linkText01: '',
			link02: '',
			linkText02: ''
		});
		setOpen(true);

		/**
		 * Log in after short delay
		 */
		setTimeout(function() {
			setJustLoggedIn(true);
		}, 3000);
	}

	const handleError = (msg) => {
		setLoading(false);
		setSuccess(false);
		setSnackbar({ 
			...snackbar,
			variant: 'error',
			message: msg,
			title: 'Error',
			link01: 'https://qreuz.com/documentation/troubleshooting/activate',
			linkText01: '➜ Troubleshooting.',
			link02: 'https://qreuz.com/contact-us',
			linkText02: '➜ Get in contact with our customer service.',
		});
		setOpen(true);
		reset({
			user_password: "",
			user_password_verify: ""
		}, {
			errors: true,
			dirtyFields: true,
			isDirty: true,
			isSubmitted: true,
			touched: false,
			isValid: false,
			submitCount: false,
		});
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	}

	/** 
	 * Submit form
	 */
	const onSubmit = (data) => {

		if (!loading) {
			setSuccess(false);
			setLoading(true);
		}

		const pushParams = {
			auth_key: authParam,
			user_password: data.user_password,
			user_email: userEmail
		}

		const pushData = async () => {
			try {
				const response = await QreuzAjax('qreuz_getstarted', 'activate', props, pushParams);

				if ( !response.hasOwnProperty("error") ) {
					handleSuccess(response.message, response.redirect);
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
	 * Initial load effect.
	 * */
	React.useEffect(() => {
		document.title = "Activate your account - Qreuz";
		return () => {
			clearTimeout(timer.current);
		};
	}, []);

	return (
		<div className={classes.root}>
			<h2>Nice! You're almost there.</h2>
			<p>Just one more step to get started with your new Qreuz user account.</p>
				<form
					id="qreuz_admin_form_activate"
					onSubmit={handleSubmit(onSubmit)}
					className={classes.form}
					noValidate
					autoComplete="off"
					>
						<p className={classes.username}>Username: <strong>{userEmail}</strong></p>
						<TextField 
							inputRef={register({required:true})}
							name="user_password"
							id="user_password"
							type="password"
							label="Set your password"
							error={errors.user_password}
							defaultValue=""
							disabled={loading}
							helperText={errors.user_password ? errors.user_password.message : ' '} />
						<TextField 
							inputRef={register({required:true})}
							name="user_password_verify"
							id="user_password_verify"
							type="password"
							label="Confirm your password"
							error={errors.user_password_verify}
							disabled={loading}
							defaultValue=""
							helperText={errors.user_password_verify ? errors.user_password_verify.message : ' '} />
						<p className={classes.qreuzFormLegalinfo}>By setting your password and registering an account, you are accepting our <a href="https://qreuz.com/terms-of-service" target="_blank">Terms of Service</a>, and you have read our <a href="https://qreuz.com/privacy" target="_blank">Privacy Policy</a>.</p>
						<div className={classes.wrapper}>
							<Button
								variant="contained"
								type="submit"
								disabled={loading}
								size="large"
								>
								Register account
								{loading && <CircularProgress size={24} />}
							</Button>
						</div>
						<p className={classes.qreuzLogin}>Already have an account? <Link to="admin.php?page=qreuz&subpage=login">Log in here</Link></p>
				</form>
				<Snackbar open={open} autoHideDuration={18000} onClose={handleClose}>
					<Alert onClose={handleClose} severity={snackbar.variant} elevation={6} variant="filled" {...props}>
						<AlertTitle>{snackbar.title}</AlertTitle>
						{snackbar.message}
						<Link to={snackbar.link01}>{snackbar.linkText01}</Link>
						<Link to={snackbar.link02}>{snackbar.linkText02}</Link>
					</Alert>
				</Snackbar>
		</div>		
	);
}
