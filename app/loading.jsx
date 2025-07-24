import classes from './loading.module.css';

const Loading = () => {
    return (
        <div className={classes.spinner}>
            <div className={classes.inner}></div>
            <div className={classes.inner}></div>
            <div className={classes.inner}></div>
        </div>
    );
}

export default Loading