/**
 * Basic imports/reqs.
 */
const { render, useState } = wp.element;
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";

/**
 * Material UI imports
 */
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert, AlertTitle } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';

/**
 * Custom components
 */
import QreuzAjax from './../../components/qreuz-ajax';
import { GenericContext, LocalContext } from '../../components/qreuz-state-provider/context';

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
	heading: {
		textAlign: 'left',
		marginBottom: '1em',
	},
	bold: {
		fontWeight: 'bold',
		textAlign: 'left',
	},
	wrapper: {
		margin: theme.spacing(1),
		position: 'relative',
		textAlign: 'left',
		maxWidth: 'fit-content',
	},
	formAdornment: {
		color: 'green',
	},
	qreuzLogin: {
		textAlign: 'left',
		marginTop: '1em',
	},
}));

/**
 * Yup validation schema
 * */
const validationSchemaLogin = yup.object().shape({
	user_email: yup.string()
		.email('Please enter a valid email address.')
		.required('Email is required.'),
	user_password: yup.string()
		.required('Password is required.')
		.max(86, 'Enough is enough: 86 characters maximum.')
		.matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])+/, 'This does not look like a valid password. Remember, you had used at least one of each: CAPITAL LETTERS, small letters, numbers.'),
  });

/**
 * Admin page content for: Login
 * 
 * @props
 */
export default function Login(props) {

	/**
	 * react-hook-form
	 * */
	const { handleSubmit, register, reset, errors } = useForm({
		resolver: yupResolver(validationSchemaLogin)
	});

	/**
	 * Load context.
	 * */
	const { setJustLoggedIn } = React.useContext(
		GenericContext
	);
	const { navigationPosition, setNavigationPosition } = React.useContext(
		LocalContext
	);

	/**
	 * Local state.
	 * */
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
	 * Load local styles
	 */
	const classes = useStyles();

	/**
	 * Consts
	 * */
	const timer = React.useRef();	

	/**
	 * Handlers
	 * */
	const handleSuccess = (msg,redirect) => {
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
			link01: 'admin.php?page=qreuz&subpage=getstarted',
			linkText01: '➜ No account yet?',
			link02: 'https://qreuz.com/contact-us',
			linkText02: '➜ Get in contact with our customer service.'
		});
		setOpen(true);
		reset({
			user_password: ""
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
	 * */
	const onSubmit = (data) => {

		if (!loading) {
			setSuccess(false);
			setLoading(true);
		}

		const pushParams = {
			password: data.user_password,
			email: data.user_email
		}

		const pushData = async () => {
			try {
				const response = await QreuzAjax('qreuz_get_started', 'login', props, pushParams);

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
		setNavigationPosition('getstarted');
		document.title = "Login - Qreuz";
		return () => {
			clearTimeout(timer.current);
		};
	}, []);

	return (
		<div className={classes.root}>
				<form
					id="qreuz_admin_form_login"
					onSubmit={handleSubmit(onSubmit)}
					className={classes.form}
					noValidate
					autoComplete="off"
					>
						<Typography component="h5" className={classes.heading + ' ' + classes.bold}>
							Log in to your user account at Qreuz
						</Typography>
						<TextField 
							inputRef={register({required:true})}
							name="user_email"
							id="user_email"
							type="text"
							label="Email"
							disabled={loading}
							error={errors.user_email}
							defaultValue=""
							helperText={errors.user_email ? errors.user_email.message : ' '} />
						<TextField 
							inputRef={register({required:true})}
							name="user_password"
							id="user_password"
							type="password"
							label="Password"
							disabled={loading}
							error={errors.user_password}
							defaultValue=""
							helperText={errors.user_password ? errors.user_password.message : ' '} />
						<div className={classes.wrapper}>
							<Button
								variant="contained"
								type="submit"
								disabled={loading}
								size="large"
								>
								Log in
								{loading && <CircularProgress size={24} />}
							</Button>
						</div>
						<p className={classes.qreuzLogin}>No account yet? <Link to="admin.php?page=qreuz&subpage=getstarted">Get started here</Link></p>
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
