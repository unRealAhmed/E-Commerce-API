exports.signupHtmlTemplate = (firstName) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to E-Commerce</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f3f3f3;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
        }

        .header {
            background-color: #630e2b;
            color: #fff;
            text-align: center;
            padding: 20px;
            font-size: 24px;
        }

        .content {
            padding: 20px;
            text-align: center;
        }

        .footer {
            background-color: #630e2b;
            color: #fff;
            text-align: center;
            padding: 10px;
        }

        .footer a {
            color: #fff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to E-Commerce</h1>
        </div>
        <div class="content">
            <p>Hello ${firstName},</p>
            <p>We're thrilled to have you as part of our E-Commerce community. Get ready to discover exciting products, exclusive offers, and a delightful shopping experience. Let's make your shopping journey a success together! 🌟</p>
            <p>If you have any questions or need assistance, feel free to reach out to our support team. Happy shopping!</p>
        </div>
        <div class="footer">
            <p>Stay in touch:</p>
            <a href="#" style="margin-right: 10px;"><img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" alt="Twitter" width="30px" height="30px"></a>
            <a href="#" style="margin-right: 10px;"><img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" alt="Facebook" width="30px" height="30px"></a>
            <a href="#"><img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" alt="Instagram" width="30px" height="30px"></a>
        </div>
    </div>
</body>
</html>
`;
