const validator = require('../utils/validator');
const removeFile = require('../utils/remove_file');
const companyValidation = async (req, res, next) => {
    const validationRule = {
        "name":"required|string",
        "slogan":"required|string",
        "phone_no":"required|string",
        "logo":"required",
        "external_phoneno":"required|string",
        "email":"required|string",
        "social_media":"required",
        "sanchalak":"required|string",
        "pradhan_sanchalak":"required|string",
        "reporter":"required|string",
        "salahakar":"required|string",
        "ji_pra_ka_ru_d_no":"required|integer",
        "media_biva_registration_cretificate_no":"required|integer",
        "press_council_registration_no":"required|integer",
        "local_pra_registration_no":"required|integer",
        "privacypolicy":"required|string",
        "company_description":"required|string",
    };    
     if(req.file!==undefined){
        delete validationRule['logo'];
    }  
   
    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            if(req.file!==undefined){
                removeFile(req.file.filename);
            }
            const errValue = err.errors;
           return res.status(422)
                .send({
                    'success': false,
                    'error': errValue
                });
        } next();
    }).catch( err => {
        if(req.file!==undefined){
            removeFile(req.file.filename);
        }
        console.log(err);
        return res.status(500).send({
            "success": false,
            'error': 'server error'
        })
    } )
}
// const editCompanyValidation = async (req, res, next) => {
//     const validationRule = {
//         "name":"required|string",
//         "slogan":"required|string",
//         "phone_no":"required|string",
//         "external_phoneno":"required|string",
//         "email":"required|string",
//         "sanchalak":"required|string",
//         "pradhan_sanchalak":"required|string",
//         "reporter":"required|string",
//         "salahakar":"required|string",
//         "ji_pra_ka_ru_d_no":"required|integer",
//         "media_biva_registration_cretificate_no":"required|integer",
//         "press_council_registration_no":"required|integer",
//         "local_pra_registration_no":"required|integer",
//         "privacypolicy":"required|string",
//         "company_description":"required|string",
//     };    
//     await validator(req.body, validationRule, {}, (err, status) => {
//         if (!status) {

//             const errValue = err.errors;
//            return res.status(422)
//                 .send({
//                     'success': false,
//                     'error': errValue
//                 });
//         } next();
//     }).catch( err => {

//         console.log(err);
//         return res.status(500).send({
//             "success": false,
//             'error': 'server error'
//         })
//     } )
// }


module.exports = {
    companyValidation,
    // editCompanyValidation

};