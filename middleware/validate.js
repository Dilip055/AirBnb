    import ExpressError from "../utils/ExpressError.js";


    const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
    throw new ExpressError(error.details[0].message, 400);
    }
    next();
    };

    export default validate;
