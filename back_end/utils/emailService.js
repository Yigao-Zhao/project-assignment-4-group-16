const nodemailer = require('nodemailer');

// 配置 SMTP 服务器
const transporter = nodemailer.createTransport({
    host: 'smtp.163.com', // 163 邮箱 SMTP 服务器
    port: 465,            // SMTP 端口号
    secure: true,         // 使用 SSL
    auth: {
        user: 'wangzhenbang2023@163.com', // 你的 163 邮箱地址
        pass: 'KCWKk36UmiQYUubY', // 你的 SMTP 授权码
    },
});

// 发送邮件功能
const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: '"Your Store" <wangzhenbang2023@163.com>', // 发件人
            to,                                       // 收件人
            subject,                                  // 邮件主题
            text,                                     // 纯文本内容
            html,                                     // HTML 内容
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };