export default class QreuzHelperErrorBoundary extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = { hasError: false };
	}
  
	static getDerivedStateFromError(error) {
	  // Update state so the next render will show the fallback UI.
	  return { hasError: true };
	}
  
	componentDidCatch(error, errorInfo) {
	  // You can also log the error to an error reporting service
	  //logErrorToMyService(error, errorInfo);
	}
  
	render() {
	  if (this.state.hasError) {
		// You can render any custom fallback UI
		return (
			<div>
				<h3>An error occured.</h3>
				<p>Please try again.</p>
			</div>
		);
	  }
  
	  return this.props.children; 
	}
  }
