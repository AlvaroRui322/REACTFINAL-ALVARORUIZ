import {Link, useRouteError} from "react-router-dom";

const NotFound = () => {
    const error = useRouteError();
    console.log(error);
    return (
        <div>404
            <p>{error.message}</p>
            <p>{error.statusText}</p>
            <Link to="/">Volver al menú</Link>
        </div>
    )
}

export default NotFound