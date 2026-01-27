const { User } = require('../models'); // Model User untuk lookup
const { verifyToken } = require('../helpers/jwt'); // Helper untuk verify JWT

module.exports = async function authentication(req, res, next) {
    try {
        const authHeader = req.headers.authorization; // Mendapatkan header Authorization

        if(!authHeader) {
            throw { name: 'Unauthorized', message: 'Token is not provided' }; // Jika header Authorization tidak ada
        }

        const token = authHeader.split(' '); // Bearer <token>
        const tokenType = token[0]; // 'Bearer'
        const accessToken = token[1]; // '<token>'

        if(tokenType !== 'Bearer' || !accessToken) {
            throw { name: 'Unauthorized', message: 'Invalid token format' }; // Jika format token salah
        }

        const payload = verifyToken(accessToken); // Verifikasi token dan dapatkan payload
        const user = await User.findByPk(payload.id); // Cari user berdasarkan ID dari payload

        if(!user) {
            throw { name: 'Unauthorized', message: 'User not found' }; // Jika user tidak ditemukan
        }
        req.user = {
            id: user.id, // Menyimpan informasi user di req.user untuk digunakan di route selanjutnya
            email: user.email, // Menyimpan informasi user di req.user untuk digunakan di route selanjutnya
            role: user.role 
        };
        next(); // Lanjut ke middleware atau route berikutnya
    } catch (error) {
       return next(error); // Kirim error ke error handling middleware
    }
};