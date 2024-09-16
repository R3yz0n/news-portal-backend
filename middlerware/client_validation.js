const validator = require('../utils/validator');

const clientValidation = async (req, res, next) => {
    const validationRule = {
        "name":"required|string",
        "address":"required|string",
        "phone_no":"required|string",
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            const errValue = err.errors;
           return res.status(422)
                .send({
                    'success': false,
                    'error': errValue
                });
        } next();
    }).catch( err => {
        console.log(err);
        return res.status(500).send({
            "success": false,
            'error': 'server error'
        })
    } )
}
module.exports = {
    clientValidation
};