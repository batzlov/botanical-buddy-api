module.exports = {
    secret: process.env.SECRET || 'Y3MHznKERKRDh3CEGF8uEcXKnf28QPu6g97Ju563dyreDnzQk2Vs2hCtaaZUWFVy',
    jwtExpiresAfter: 60 * 60 * 1000,
    cookieName: '_wab_auth_jwt'
};