/**
 * Basic imports/reqs.
 */
const { useState } = wp.element;
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";

/**
 * Material UI imports
 */
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Custom components
 */
import QreuzAjax from './../../components/qreuz-ajax';
import { GenericContext, LocalContext } from './../../components/qreuz-state-provider/context';
const LoadActivate = React.lazy(() => import('./load-activate.js'));
const LoadGetstarted = React.lazy(() => import('./load-getstarted.js'));

/**
 * Define local styles.
 */
const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',		
		alignItems: 'center',
		textAlign: 'center',
	},
	isHidden: {
		display: 'none',
		visibility: 'hidden',
	},
	form: {
		maxWidth: '500px',
		display: 'inline-block',
		alignItems: 'center',
		backgroundColor:'#ffffff',
		padding: '2em',
	  '& > *': {
		display: 'block',
	  },
	},
	wrapper: {
		textAlign: 'center',
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
		textAlign: 'center',
	},
	qreuzLogin: {
		textAlign: 'center',
	},
	arrowIcon: {
		display: 'block',
		width: '100%',
		height: '3em',
		color: '#14b084',
		marginBottom: '1em',
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
	 * Load context.
	 * */
	const { user, authKey, contextLoading } = React.useContext(
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
	const [disabled, setDisabled] = useState(false);
	const [open, setOpen] = useState(false);
	const [snackbar, setSnackbar] = useState({
		variant: '',
		message: '',
		title: '',
		linksTitle: '',
		linkTroubleshooting: 'https://qreuz.com/documentation/troubleshooting/getstarted',
		linkTextTroubleshooting: '➜ Troubleshooting.',
		linkLogin: 'https://qreuz.com/account/login',
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
	 * Initial load effect.
	 * */
	React.useEffect(() => {
		setNavigationPosition('getstarted');
		document.title = "Get started - Qreuz";
		return () => {
			clearTimeout(timer.current);
		};
	}, []);

	if ( contextLoading === false ) {
		if ( authKey === false ) {
			/**
			 * Return Getstarted inital phase.
			 */
			return (
				<LoadGetstarted {...props} />
			);
		} else {
			/**
			 * Return Getstarted set password phase.
			 */
			return(
				<LoadActivate {...props} />
			)
		}
	} else {
		return (
			<CircularProgress size={24} />
		)
	}
}
