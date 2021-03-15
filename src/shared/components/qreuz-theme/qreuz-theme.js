import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const qreuzThemeVars =  {
	green01: '#14b084',
	green02: '#00cc99',
	green03: '#00ffcc',
	green04: '#339999',
	green05: '#00F2A9',
	grey01: '#999999',
	grey02: '#666666',
	grey03: '#f3f3f3',
	yellow01: '#fff000',
	white: '#ffffff',
	notification: '#FF715B',
	borderRadius: '4px',
	background: '#fafafa',
};

let qreuzThemeObj = createMuiTheme({
	shapes: {
		borderRadius: qreuzThemeVars.borderRadius,
		gridSpacing: '5em',
		itemPadding: '.2rem 2rem',
	},
	palette: {
		primary: {
			main: '#14b084',
			highlight: qreuzThemeVars.green04,
			background: qreuzThemeVars.grey03,
		},
		secondary: {
			main: '#00cc99',
		},
		data: {
			primary:qreuzThemeVars.green04,
			background:qreuzThemeVars.lightgreen01,
			backgroundHighlight:qreuzThemeVars.lightgreen02,
			foreground:qreuzThemeVars.green01,
			highlight:qreuzThemeVars.yellow01,
			data01:'#00cc99',
			data02:'#ccb400',
			data03:'#339999',
			backgroundFill: '#eaeaea',
			lightgrey: 'rgba(240, 245, 245,0.5)',
			lightestgrey: 'rgba(240, 245, 245,0.3)',
			c01: '#4E5A7E',
			c02: '#339999',
			c03: '#14B084',
			c04: '#00cc99',
			c05: '#EB9486',
		},
		qreuzThemeColors: {
			green01: '#14b084',
			green02: '#00cc99',
			green03: '#00ffcc',
			green04: '#339999',
			green05: '#00F2A9',
			lightgreen01: 'rgba(20,176,132,0.4)',
			lightgreen02: 'rgba(20,176,132,0.6)',
			grey01: '#999999',
			grey02: '#666666',
			grey03: '#f3f3f3',
			grey04: 'rgba(145, 158, 171,1)',
			yellow01: '#fff000',
			background: '#fafafa',
			notification: '#FF715B',
			white: '#FFFFFF',
		},
		success: {
			main: '#00cc99',
		},
		text: {
			secondary: '#999999',
			third: '#cccccc',
			fourth: '#e1e1e1',
			bright: '#ffffff',
		},
	},
	typography: {
		fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
		bold: {
			fontFamily: '"Roboto-Bold","Roboto","Helvetica","Arial",sans-serif',
		},
		medium: {
			fontFamily: '"Roboto-Medium","Roboto","Helvetica","Arial",sans-serif',
		},
		h1: {
			fontSize: '2rem',
			fontWeight: '700',
			fontFamily: '"BwModelica-ExtraBold","Roboto-Bold","Roboto","Helvetica","Arial",sans-serif',
		},
		h2: {
			fontSize: '1.5rem',
			fontWeight: '700',
			fontFamily: '"BwModelica-Bold", "Roboto-Bold","Roboto","Helvetica", "Arial",sans-serif',
		},
		h3: {
			fontSize: '1rem',
			fontWeight: '700',
			fontFamily: '"BwModelica-ExtraBold","Roboto-Bold","Roboto","Helvetica","Arial",sans-serif',
		},
		h4: {
			fontSize: '1.5rem',
			fontWeight: '700',
			fontFamily: '"Roboto-Bold","Roboto","Helvetica","Arial",sans-serif',
		},
		h5: {
			fontSize: '1rem',
			fontWeight: '700',
			fontFamily: '"Roboto-Bold","Roboto","Helvetica","Arial",sans-serif',
		},
		h6: {
			fontSize: '1rem',
			fontWeight: '600',
			fontFamily: '"Roboto-Medium","Roboto","Helvetica","Arial",sans-serif',
		},
	},
	overrides: {
		MuiAccordion: {
			root: {
				'&:before': {
					display: 'none',
				},
				'& .accordionSettingsSecondaryHeading': {
					fontSize: '0.78rem',
					display: 'inline',
					verticalAlign: 'baseline',
				}
			},
			rounded: {
				borderRadius: qreuzThemeVars.borderRadius,
			},
		},
		MuiAppBar: {
			colorPrimary: {
				color: qreuzThemeVars.white,
			},
		},
		MuiButton: {
			root: {
				margin: 0,
				textTransform: 'none',
				border: 0,
				borderRadius: 4,
				transition: '0.5s',
				height: '48px',
				padding: '0 30px',
				background: 'none',
				fontWeight: 'normal',
				color: qreuzThemeVars.grey02,
				'& span': {
					whiteSpace: 'nowrap',
				},
				'&:hover' : {
					backgroundColor: 'none',
					color: qreuzThemeVars.green05,
					fontWeight: '500',
					transition: '0.5s',
				},
				'&:focus' : {
					outline: 'none',
					boxShadow: 'none',
				},
				'&:active' : {
					color: qreuzThemeVars.white,
				},
			},
			textPrimary: {
				'&:hover' : {
					backgroundColor: qreuzThemeVars.grey03,
					color: qreuzThemeVars.green01,
				},
				'&:focus' : {
					outline: 'none',
					boxShadow: 'none',
				},
				'&:active' : {
					color: '#999999',
					outline: 'none',
					boxShadow: 'none',
				},
			},
			contained: {
				background: qreuzThemeVars.green04,
				backgroundColor: qreuzThemeVars.green04,
				//background: 'linear-gradient(45deg, #14b084 30%, #00cc99 90%)',
				color: 'white',
				'&:hover': {
					//background: qreuzThemeVars.green04,
					backgroundColor: 'inherit',
					//background: 'linear-gradient(45deg, #14b084 10%, #00cc99 60%)',
					color: 'white',
				},
				'&.Mui-disabled': {
					background: qreuzThemeVars.grey01,
					//background: 'linear-gradient(45deg, #cccccc 10%, #cccccc 60%)',
					color: 'white',
				},
			},
			containedPrimary: {
				background: qreuzThemeVars.green01,
				fontFamily: '"Roboto-Medium", "Helvetica", "Arial", sans-serif',
				//background: 'linear-gradient(45deg, #14b084 30%, #00cc99 90%)',
				color: qreuzThemeVars.white,
				'& :hover': {
					//background: 'linear-gradient(45deg, #14b084 10%, #00cc99 60%)',
					color: qreuzThemeVars.white,
				},
				'&.Mui-disabled': {
					//background: qreuzThemeVars.green04,
					background: 'linear-gradient(45deg, #cccccc 10%, #cccccc 60%)',
					color: qreuzThemeVars.white,
				},
			},
			label: {
				
			},
		},
		MuiBadge: {
			colorPrimary: {
				backgroundColor: qreuzThemeVars.notification,
			},
			colorSecondary: {
				backgroundColor: qreuzThemeVars.green05,
			},
		},
		MuiIconButton: {
			root: {
				color: qreuzThemeVars.grey01,
				'& .MuiSvgIcon-root': {
					//color: qreuzThemeVars.grey01,
				},
				'& .MuiBadge-badge': {
					//backgroundColor: qreuzThemeVars.green05,
				},
			},
		},
		MuiContainer: {
			root: {
				textAlign: 'center',
				padding: '1em',
			},
		},
		MuiCssBaseline: {
			'@global': {
				//fontFamily: [openSansRegular],
			},
		},
		MuiFormControl: {
			root: {
				width: '100%',
				margin: '1em 0',
			},
		},
		MuiFormControlLabel: {
			root: {
				width: '100%',
			},
			label: {
				fontSize: '0.9rem',
			},
		},
		MuiInputBase: {
			root: {
				width: '100%',
			},
			input: {
				border: '0 !important',
				outline: '0 !important',
				boxShadow: 'unset !important',
				backgroundColor: 'inherit !important',
				minHeight: '40px !important',
				padding: '0 !important',
			},
		},
		MuiInput: {
			underline: {
				'&:before': {
					borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
				},
			},
		},
		MuiLinearProgress: {
			root: {
				backgroundColor: qreuzThemeVars.background,
				position: 'absolute',
				top: 0,
				left: 0,
				zIndex: '99998',
				width: '100%',
			},
			bar: {
				backgroundColor: qreuzThemeVars.background,
			},
			barColorPrimary: {
				backgroundColor: qreuzThemeVars.background,
			},
			colorPrimary: {
				backgroundColor: qreuzThemeVars.green01,
			},
		},
		MuiCircularProgress: {
			root: {
				position:'absolute',
			},
		},
		MuiGrid: {
			item: {
				marginBottom: '1em',
			},
			'spacing-xs-6': {

				width: '100%',
				margin: 0,
						//padding: '4em',


			},
		},
		MuiCardActions: {
			root: {
				width: '100%',
				'& .MuiCardContent-root': {
					width: '100%',
				},
			},
		},
		MuiCardContent: {
			root: {
				'& .MuiSvgIcon-root': {
					verticalAlign: 'middle',
					color: '#999999',
					//margin: '.3em 0 .3em 0',
				},
			},
		},
		MuiSelect: {
			select: {
				padding: '0',
				minHeight: '40px !important',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
			}
		},
		MuiSnackbar: {
			root: {
				'& .MuiAlert-root': {
					whiteSpace: 'pre-wrap',
					textAlign: 'left',
					alignItems: 'left',
					'& .MuiAlertTitle-root': {
						fontWeight: 'bold',
					},
					'& .MuiAlert-message a': {
						display: 'block',
						padding: '.4em 0',
						color: '#ffffff',
						'&:hover': {
							textDecoration: 'underline',
						},
					},
					'& .MuiAlert-message p': {
						fontSize: '1em',
					},
				},
				'& .MuiAlert-filledError': {
					fontWeight: '400',
					'& .MuiAlert-action': {
						'& .MuiButtonBase-root': {
							backgroundImage: 'none',
						},
					},
					'& .MuiSvgIcon-root': {
						color: qreuzThemeVars.white,
					},
				},
				'& .MuiAlert-filledSuccess': {
					fontWeight: '400',
					'& .MuiSvgIcon-root': {
						color: qreuzThemeVars.white,
					},
				},
			},
		},
		MuiTabs: {
			root: {
				'& a': {
					'&:hover' : {
						color: qreuzThemeVars.grey03,
					},
					'&:focus' : {
						outline: 'none',
						boxShadow: 'none',
					},
					'&:active' : {
						outline: 'none',
						boxShadow: 'none',
					},
				},
			},
			indicator: {
				backgroundColor: qreuzThemeVars.white,
			},
		},
		MuiTextField: {
			root: {
				display: 'block',
			},
		},
		MuiTypography: {
			h1: {
				margin: '0 0 0 0',
			},
			h2: {
				margin: '0 0 0 0',
			},
			h3: {
				margin: '0 0 0 0',
			},
			h4: {
				margin: '0 0 0 0',
			},
			h5: {
				margin: '0 0 0 0',
			},
			h6: {
				margin: '0 0 0 0',
			},
			body1: {
				fontSize: '0.875rem',
			},
			body2: {
				fontSize: '0.875rem',
			},
		},
		MuiPaper: {
			rounded: {
				borderRadius: '4px',
			},
		},
		formError: {
			'& .MuiFormHelperText-root': {
					color: 'red',
			},
			'& .MuiInput-underline:after': {
				borderBottomColor: 'red',
			},
			'& label.Mui-focused': {
				color: 'rgba(0, 0, 0, 0.54)',
			  },
		},
	},
});
export const qreuzTheme = responsiveFontSizes( qreuzThemeObj );
