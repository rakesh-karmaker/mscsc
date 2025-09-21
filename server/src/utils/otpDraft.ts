export default function otpDraft(otp: string) {
  const year = new Date().getFullYear();
  return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <title>MSCSC Email Sender</title>
            </head>

            <body style="margin:0; background-color: #e9dede00; box-sizing: border-box;">
                <center class="wrapper">
                    <table class="main" style="width: 100%; max-width: 568px; background-color: #f9f9f9; height: 100%; border-spacing: 0;">
                        <tr>
                            <td style="width: 100%; padding: 0;">
                                <table class="top" style="border-spacing: 0;width: 100%; height: 100%; background-color: #f9f9f9; background-image: url('https://scontent.xx.fbcdn.net/v/t1.15752-9/434360080_414158554560714_4905350436994214544_n.jpg?stp=dst-jpg_p403x403&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=3do5PVBv3zcAb5Q6oD5&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdXckBBA2xrh34kpUznTinLk5eNjUn3UhYP4h4u5eK1tpQ&oe=664062D4'); background-repeat: no-repeat; background-size: 100% 230px; background-position: top center;">
                                    <tr>
                                        <td><center><img src="https://ik.imagekit.io/testingimage/email_header_blue.png?updatedAt=1738585803510" alt="logo" style="width: 100%; height: 100%; margin: 0; padding: 0;"></center></td>
                                    </tr>
                                    <tr>
                                        <td><h2 style="margin: 0; padding: 0 20px; font-size: 32px; font-weight: 500; line-height: 39px; letter-spacing: 0.01em; text-align: center; margin-top: 20px;  color: #11181c;">Password Change Request</h2></td>
                                    </tr>
                                    <tr>
                                        <td><center><p style="margin: 10px 0 30px 0; padding: 0 20px; font-size: 16px; max-width: 400px; text-align: center; color: #11181c; opacity: 0.8;">We've received a password change request for your MSCSC Member account.</p></center></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    

                        <tr>
                            <td style="width: 100%; ; background-color: rgb(255, 255, 255); padding: 0;  border: 3px solid #f9f9f9;">
                                <table class="id-c" style="border-spacing: 0;background-color:rgb(255, 255, 255); width: 100%;  height: 100%;">
                                    <tr>
                                        <td>
                                            <center>
                                                <table class="id-con" style="border-spacing: 0; padding: 40px 0px; text-align: center; width: 100%;  height: 150px;background-color: rgb(255, 255, 255);">
                                                    <tr>
                                                        <td>
                                                            <p style="margin: 0; padding: 0; color: #11181c;">Here is your one-time password <em>(OTP)</em>:</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h1 style="margin: 0; padding: 0;letter-spacing: 0.06em; font-size: 56px; font-weight: 500; user-select: text; line-height: 46px; margin-top: 15px; color: #11181c;">${otp}</h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </center>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="width: 100%;  background-color: #f9f9f9; padding: 0;">
                                <center>
                                    <table class="text" style="border-spacing: 0;width: 90%; max-width: 265px; text-align: center; margin: 50px 0px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0; padding: 0;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;font-weight: 600;color: rgba(0, 0, 0, 0.589);">This OTP will expire in 1 hour. If you did not request a password change, please ignore this email, no changes will be made to your account.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </center>
                            </td>
                        </tr>

                        <tr>
                            <td style="width: 100%;  background-color: #3b82f6; padding: 0;">
                                <center>
                                    <table class="footer" style="border-spacing: 0;">

                                        <tr>
                                            <td>
                                                <center>
                                                    <p style="margin-bottom: 10px; margin-top: 25px;">
                                                        <a href="https://www.facebook.com/MSCSC2014" class="facebook" title="facebook" style="text-decoration: none;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; text-align: center; font-size: 17px;color: rgba(249, 249, 249, 0.856); margin: 10px 11px;">Facebook</a><span style="font-size: 30px; font-weight: 400; color: #f9f9f9; margin: 0;">|</span>
                                                        <a href="https://mscsc.netlify.app/" class="web" title="website" style="text-decoration: none;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; text-align: center; font-size: 17px;color: rgba(249, 249, 249, 0.856); margin: 10px 11px;">Website</a><span style="font-size: 30px; font-weight: 400; color: #f9f9f9; margin: 0;">|</span>
                                                        <a href="https://www.instagram.com/_mscsclub_" class="instagram" title="instagram" style="text-decoration: none;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; text-align: center; font-size: 17px;color: rgba(249, 249, 249, 0.856); margin: 10px 11px;">Instagram</a>
                                                    </p>
                                                </center>
                                            </td>
                                        </tr>


                                        <tr>
                                            <td>
                                                <p style="text-align: center; margin-top: 5px; padding: 0;font-size: 15px; color: rgba(255, 255, 255, 0.863); max-width: 400px;">© ${year} MSCSC || All Rights Reserved</p>
                                            </td>
                                        </tr>

                                    </table>
                                </center>
                            </td>
                        </tr>
                    </table>
                </center>
            </body>
        </html>
        `;
}
