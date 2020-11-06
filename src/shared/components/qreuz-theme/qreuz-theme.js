import { createMuiTheme } from '@material-ui/core/styles';

const qreuzThemeVars =  {
	green01: '#14b084',
	green02: '#00cc99',
	green03: '#00ffcc',
	green04: '#339999',
	grey01: '#999999',
	grey02: '#666666',
	grey03: '#f3f3f3',
	yellow01: '#fff000',
	white: '#ffffff',
};

const openSansRegular = {
	fontFamily: 'OpenSans-Regular-webfont,"Open Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 400,
};

export const qreuzTheme = createMuiTheme({
		palette: {
			primary: {
				main: '#14b084',
			},
			secondary: {
				main: '#00cc99',
			},
			success: {
				main: '#00cc99',
			},
			text: {
				secondary: '#999999',
				third: '#cccccc',
				fourth: '#e1e1e1',
			},
		},
		typography: {
			fontFamily: 'OpenSans-Regular-webfont,"Open Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
			bold: {
				fontFamily: 'OpenSans-Bold-webfont,"Open Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
			},
			h1: {
				fontSize: '2rem',
			},
			h2: {
				fontSize: '1.5rem',
			},
			h3: {
				fontSize: '1rem',
			},
			h4: {
				fontSize: '1.5rem',
			},
			h5: {
				fontSize: '1rem',
			},
			h6: {
				fontSize: '1.3rem',
			},
		},
		overrides: {
			MuiAppBar: {
				colorPrimary: {
					color: qreuzThemeVars.white,
				},
			},
			MuiButton: {
				root: {
					margin: '1em 0 0',
					textTransform: 'none',
					border: 0,
					borderRadius: 6,
					//transition: 'background .5s ease-in',
					height: '48px',
					padding: '0 30px',
					'&:hover' : {
						backgroundColor: '#eeeeee',
						color: '#000000',
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
					fontFamily: 'OpenSans-Bold-webfont, -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
					background: 'linear-gradient(45deg, #14b084 30%, #00cc99 90%)',
					color: 'white',
					'&:hover': {
						background: 'linear-gradient(45deg, #14b084 10%, #00cc99 60%)',
						color: 'white',
					},
					'&.Mui-disabled': {
						background: 'linear-gradient(45deg, #cccccc 10%, #cccccc 60%)',
						color: 'white',
					},
				},
				label: {
					
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
					fontFamily: [openSansRegular],
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
				bar: {
					backgroundColor: qreuzThemeVars.colorPrimary,
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
			},
			MuiCardActions: {
				root: {
					width: '100%',
					'& .MuiCardContent-root': {
						width: '100%',
					},
				},
			},
			MuiCardHeader: {
				root: {
					content: {
						
					},
				},
				title: {
					fontWeight: 'bold',
					fontFamily: 'BwModelica-bold',
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
					margin: '0 0 1em 0',
				},
				h2: {
					margin: '0 0 1em 0',
				},
				h3: {
					margin: '0 0 1em 0',
				},
				h4: {
					margin: '0 0 1em 0',
				},
				h5: {
					margin: '0 0 1em 0',
				},
				h6: {
					margin: '0 0 1em 0',
				},
			},
			MuiPaper: {
				rounded: {
					borderRadius: '9px',
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
