import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

const Export = (props) => {
  const { classes, exportFiles } = props;

  return (
    <div className='export'>
      <Button size='small' variant="contained" color="primary" className={classes.button} onClick={exportFiles}>
        Export files
      </Button>
      <Button size='small' variant="contained" color="primary" className={classes.button}>
        Create Application
      </Button>
    </div>
  );
};

Export.propTypes = {
  classes: PropTypes.object.isRequired,
  exportFiles: PropTypes.func.isRequired,
  components: PropTypes.array.isRequired,
};

export default withStyles(styles)(Export);
