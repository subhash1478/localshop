	
//
// ──────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: M O N G O O S E   C O N N E C T   F R O M   M L A B : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────
//
module.exports=  {
    HOST:'139.59.12.86',
    USERNAME:'root',
    PASSWORD:'A3CEKC74L7KCRN7I',
    PORT:'27017',
    DATABASE:'localshop',
    SECRET:'QWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()1234567890',
    SITE_BASE_URL:'http://139.59.12.86:3001/',
   // SITE_BASE_URL:'https://classfied.herokuapp.com/',
   
   status: {
        OK: 200,
        CREATED: 201,
        FOUND: 302,
        BAD_REQUEST: 400,
        NOT_AUTHORIZED: 401,
        PAYMENT_REQUERED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        SERVER_ERROR: 500,
        NO_SERVICE: 503
    },
}
